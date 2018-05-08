import {Pool} from 'pg'; // Postgres
import Joi from 'joi'; // validation
import config from '../../config';
import SensorData from '../../lib/SensorData';

// Connection object
const cn = `postgres://${config.PGUSER}:${config.PGPASSWORD}@${config.PGHOST}:${config.PGPORT}/${config.PGDATABASE}?ssl=${config.PGSSL}`;

// Create a pool object
const pool = new Pool({
  connectionString: cn,
  idleTimeoutMillis: config.PG_CLIENT_IDLE_TIMEOUT,
});

// Validation schemas
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

  Joi.validate(event.body, _bodySchema, function(err, result) {
    if (err) {
      callback(null,
      {
        statusCode: 400,
        body: JSON.stringify(err.message),
      });
    }
  });

  // Properties
  const id = event.pathParameters.id;
  const properties = event.body;

  const sensorData = new SensorData(config, pool);

  // Query
  sensorData.insert(id, properties)
    .then((result) => {
      console.log('Data inserted: ' + JSON.stringify(result.rows));
      callback(null, {statusCode: 200, body: JSON.stringify(result.rows)});
    }).catch((err) => {
      console.log('Error inserting data: ' + err.message);
      callback(null, {statusCode: 500, body: JSON.stringify(err.message)});
    });
};
