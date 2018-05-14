import {Pool} from 'pg'; // Postgres
import Joi from 'joi'; // validation

// Local objects
import config from '../../config';
import { handleResponse } from '../../lib/util';
import SensorData from '../../lib/SensorData';

// Connection object
const cn = `postgres://${config.PGUSER}:${config.PGPASSWORD}@${config.PGHOST}:${config.PGPORT}/${config.PGDATABASE}?ssl=${config.PGSSL}`;

// Create a pool object
const pool = new Pool({
  connectionString: cn,
  idleTimeoutMillis: config.PG_CLIENT_IDLE_TIMEOUT,
});

// Validation schema
const _bodySchema = Joi.object().keys({
  properties: Joi.object().required(),
});

const _pathSchema = Joi.object().keys({
  id: Joi.number().min(1).required(),
});

/**
 * Endpoint for new sensor objects
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
  // Validate inputs
  const properties = await Joi.validate(event.body, _bodySchema);
  const path = await Joi.validate(event.pathParameters, _pathSchema);

  // Sensor class
  const sensorData = new SensorData(config, pool);

  // Add sensor data
  const result = await sensorData.insert(path.id, properties);
  console.log('Added sensor data');
  handleResponse(callback, 200, result.rows[0]);
  }

  catch (err) {
    if (err.isJoi) handleResponse(callback, 400,  {message: err.details[0].message} );
    else handleResponse(callback, 500, err.message);
  }
};
