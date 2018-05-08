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

const _paramSchema = Joi.object().keys({
  bbox: Joi.array().length(4).items(Joi.number().min(-180).max(180),
  Joi.number().min(-90).max(90), Joi.number().min(-180).max(180),
  Joi.number().min(-90).max(90)).default(config.GEO_EXTENTS_DEFAULT),
  geoformat: Joi.string().default(config.GEO_FORMAT_DEFAULT)
    .valid(config.GEO_FORMATS),
});

/**
 * Endpoint for sensor objects
 * @function sensors
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Object} callback - Callback (HTTP response)
 */
export default (event, context, callback) => {
  // Catch database errors
  // TODO pass this back to Lambda
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
  });

  // Validate URL params
  Joi.validate(event.queryStringParameters, _paramSchema,
    function(err, result) {
    if (err) {
      console.log(err);
      callback( null, {
        statusCode: 400,
        body: JSON.stringify(err.message),
      });
    }
  });

  const properties = {
    bbox: !!event.queryStringParameters.bbox ||
      config.GEO_EXTENTS_DEFAULT,
    geoformat: !!event.queryStringParameters.geoformat ||
      config.GEO_FORMAT_DEFAULT,
  };

  // Sensor class
  const sensor = new Sensors(config, pool);

  // Call database model
  sensor.all(properties)
    .then((data) => {
      console.log('Retrieved sensor data');
      callback(null, {statusCode: 200, body: JSON.stringify(data)});
    })
    .catch((err) => {
      console.log('Error retrieving sensor data: ' + err.message);
      callback(null, {statusCode: 500, body: JSON.stringify(err.message)});
    });
};
