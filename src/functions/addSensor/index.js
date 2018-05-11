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
const _schema = Joi.object().keys({
  properties: Joi.object().required(),
  location: Joi.object().required().keys({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
  }),
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
  // Catch database errors
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
  });

  const body = JSON.parse(event.body);

  // Validate URL params
  Joi.validate(body, _schema,
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
  sensor.insert(body.properties, body.location)
  .then((data) => {
    console.log('New sensor properties: ' + JSON.stringify(body.properties));
    console.log('Added sensor');
    callback(null,
      {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({
          statusCode: 200,
          result: data.rows, // TODO - should this be rows[0]?
        }),
      });
  })
  .catch((err) => {
    console.log('Error adding sensor: ' + err.message);
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
