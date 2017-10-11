import {Pool} from 'pg'; // Postgres
import Joi from 'joi'; // validation
import addSensorData from './model';
import config from '../../config';

// Connection object
const cn = `postgres://${config.PGUSER}:${config.PGPASSWORD}@${config.PGHOST}:${config.PGPORT}/${config.PGDATABASE}?ssl=${config.PGSSL}`;

// Create a pool object
const pool = new Pool({connectionString: cn});
pool.CREATED = Date.now(); // Smash this into the pool object

// Catch database errors
// TODO pass this back to Lambda
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

// Return an error in Lambda format
const _raiseClientError = (code, err, callback) => callback(null, {
  statusCode: code,
  body: err,
});

const _successResponse = (code, body, callback) => callback(null, {
  statusCode: code,
  body: body,
});

const _bodySchema = Joi.object().keys({
  properties: Joi.object().min(1).required(),
});

const _pathSchema = Joi.object().keys({
  id: Joi.number().min(1).required(),
});

/**
 * Endpoint for sensor objects
 * @function sensors
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Object} callback - Callback (HTTP response)
 * @return {Object} response - Response passed to callback
 */
export default (event, context, callback) => {
  // Don't wait to exit loop
  context.callbackWaitsForEmptyEventLoop = false;

  let sensorId = null;
  const requestBody = event.body;

  // validate sensor/:id
  sensorId = Joi.validate(event.path, _pathSchema);
  if (sensorId.error) {
    return _raiseClientError(400, sensorId.error.message, callback);
  }

  let result = Joi.validate(requestBody, _bodySchema);
    if (result.error) {
      return _raiseClientError(400, result.error.message, callback);
    }

  console.log(event);
  console.log(event.path);

  addSensorData(config, pool).postData(sensorId.value.id,
    requestBody.properties)
    .then((data) => {
      return _successResponse(200, data, callback);
    })
    .catch((err) => {
      return _raiseClientError(500, JSON.stringify(err), callback);
    });
};
