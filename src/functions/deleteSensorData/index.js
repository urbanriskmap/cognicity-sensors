import {Pool} from 'pg'; // Postgres
import Joi from 'joi'; // validation

// Local objects
import config from '../../config';
import {handleResponse} from '../../lib/util';
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
  dataId: Joi.number().min(1).required(),
});

/**
 * Endpoint for sensor objects
 * @function sensors
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Object} callback - Callback (HTTP response)
 */
export default async (event, context, callback) => {
  try {
    // Catch database errors
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err);
    });

    // Validate
    const params = await Joi.validate(event.pathParameters, _pathSchema);

    // Sensor data class
    const sensorData = new SensorData(config, pool);

    // Delete data and send response
    const result = await sensorData.delete(params.id, params.dataId);
    console.log(result);
    if (result.rowCount < 1) {
      handleResponse(callback, 400, {message: 'Delete failed.'});
    } else {
      handleResponse(callback, 200, {});
    }
  } catch (err) {
    if (err.isJoi) {
handleResponse(callback, 400,
      {message: err.details[0].message} );
} else handleResponse(callback, 500, err.message);
  }
};
