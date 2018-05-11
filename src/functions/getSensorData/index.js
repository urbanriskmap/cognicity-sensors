import {Pool} from 'pg'; // Postgres
import Joi from 'joi'; // validation

// Local objects
import config from '../../config';
import SensorData from '../../lib/SensorData';

// Connection object
const cn = `postgres://${config.PGUSER}:${config.PGPASSWORD}@${config.PGHOST}:${config.PGPORT}/${config.PGDATABASE}?ssl=${config.PGSSL}`;

// Create a pool object
const pool = new Pool({
    connectionString: cn,
    idleTimeoutMillis: config.PG_CLIENT_IDLE_TIMEOUT,
  });

// Validation schema
const _pathSchema = Joi.object().keys({
  id: Joi.number().min(1).required(),
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

  // Validate parameters
  Joi.validate(event.pathParameters, _pathSchema, function(err, result) {
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

  // Sensor ID
  const id = event.pathParameters.id;

  // Sensor class
  const sensorData = new SensorData(config, pool);

  // Query
  sensorData.get(id)
    .then((data) => {
      console.log('Retrieved sensor data');
      console.log('Sensot id: ' + id);
      callback(null,
        {
          statusCode: 200,
          headers: headers,
          body: JSON.stringify({
            statusCode: 200,
            result: data.rows, // TODO - should this be an object or array?
          }),
        });
    }).catch((err) => {
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

