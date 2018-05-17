import {Pool} from 'pg'; // Postgres
import Joi from 'joi'; // validation

// Local objects
import config from '../../config';
import {handleResponse} from '../../lib/util';
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

/**
 * Endpoint for sensor objects
 * @function addSensor
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
    // Validate params
    const params = await Joi.validate(event.body, _schema);
    // Sensor class
    const sensor = new Sensors(config, pool);

    // Add sensor
    const result = await sensor.insert(params.properties, params.location);
    handleResponse(callback, 200, result);
    console.log('Added sensor');
  } catch (err) {
    if (err.isJoi) {
      handleResponse(callback, 400, err.details[0].message);
      console.log('Validation error: ' + err.details[0].message);
    } else {
      console.log('err', err);
      handleResponse(callback, 500, err.message);
      console.log('Error: ' + err.message);
    }
  }
};
