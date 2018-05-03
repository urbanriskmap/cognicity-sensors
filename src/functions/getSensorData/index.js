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
      callback(null,
        {
          statusCode: 400,
          body: JSON.stringify(err.message),
        });
    }
  });

  // Sensor ID
  const id = event.pathParameters.id;

  // Sensor class
  const sensorData = new SensorData(config, pool);

  // Query
  sensorData.get(id)
    .then((result) => {
      callback(null, {statusCode: 200, body: JSON.stringify(result.rows)});
    }).catch((err) => {
      callback(null, {statusCode: 500, body: JSON.stringify(err.message)});
    });
};

