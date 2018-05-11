import {Pool} from 'pg'; // Postgres
import Joi from 'joi'; // validation

// Local objects
import config from '../../config';
import Sensors from '../../lib/Sensors';

// Connection object
const cn = `postgres://${config.PGUSER}:${config.PGPASSWORD}@${config.PGHOST}:${config.PGPORT}/${config.PGDATABASE}?ssl=${config.PGSSL}`;

// Create a pool object
const pool = new Pool({
  connectionString: cn,
  idleTimeoutMillis: config.PG_CLIENT_IDLE_TIMEOUT,
});

// Validation schema
const _paramSchema = Joi.object().keys({
  bbox: Joi.array().length(4).items(Joi.number().min(-180).max(180),
  Joi.number().min(-90).max(90), Joi.number().min(-180).max(180),
  Joi.number().min(-90).max(90)).default(config.GEO_EXTENTS_DEFAULT),
  geoformat: Joi.string().default(config.GEO_FORMAT_DEFAULT)
    .valid(config.GEO_FORMATS),
});

// These headers are consistent for all responses
const headers = {
  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  'Access-Control-Allow-Credentials': true, // Cookies, HTTPS auth headers
};

/**
 * Endpoint for sensor objects
 * @function sensors
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Object} callback - Callback (HTTP response)
 */
export default (event, context, callback) => {
  console.log(JSON.stringify(event.queryStringParameters));
  // Catch database errors
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
  });

  // Set defaults for optional query params
  const properties = {
    bbox: (!!event.queryStringParameters &&
      !!event.queryStringParameters.bbox &&
      event.queryStringParameters.bbox ||
      config.GEO_EXTENTS_DEFAULT).split(','),
    geoformat: !!event.queryStringParameters &&
      !!event.queryStringParameters.geoformat &&
      event.queryStringParameters.geoformat ||
      config.GEO_FORMAT_DEFAULT,
  };

  // Validate URL params
  Joi.validate(properties, _paramSchema,
    function(err, result) {
    if (err) {
      console.log(err);
      callback(null,
        {
          statusCode: 400,
          headers: headers,
          body: JSON.stringify({
            statusCode: 400,
            result: err.message,
          }),
        });
    }
  });

  // Sensor class
  const sensor = new Sensors(config, pool);

  // Call database
  sensor.all(properties)
    .then((data) => {
      console.log('Query properties: ' + JSON.stringify(properties));
      console.log('Retrieved sensor data');
      callback(null,
        {
          statusCode: 200,
          headers: headers,
          body: JSON.stringify({
            statusCode: 200,
            result: data,
          }),
        });
    })
    .catch((err) => {
      console.log('Error retrieving sensor data: ' + err.message);
      callback(null,
        {
          statusCode: 500,
          body: JSON.stringify({
            statusCode: 500,
            result: err.message,
          }),
      });
    });
};
