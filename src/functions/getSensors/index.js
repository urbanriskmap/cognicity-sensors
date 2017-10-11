import {Pool} from 'pg'; // Postgres
import getSensors from './model';
import Joi from 'joi'; // validation
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

const _bboxSchema = Joi.array().length(4).items(Joi.number().min(-180).max(180),
    Joi.number().min(-90).max(90), Joi.number().min(-180).max(180),
    Joi.number().min(-90).max(90)).default(config.GEO_EXTENTS_DEFAULT);

const _paramSchema = Joi.object().keys({
  bbox: Joi.string().min(7).max(17),
  geoformat: Joi.string().valid(config.GEO_FORMATS)
    .default(config.GEO_FORMAT_DEFAULT),
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

  // Validate URL params
  let params = Joi.validate(event.queryStringParameters, _paramSchema);
  if (params.error) {
    return _raiseClientError(400, params.error.message, callback);
  }

  // Parse bbox string and validate coordinates
  let bbox = Joi.validate(params.value.bbox.split(','), _bboxSchema);
  if (bbox.error) {
    return _raiseClientError(400, bbox.error.message, callback);
  }

  // Call database model
  getSensors(config, pool).getData(bbox.value, params.value.geoformat)
    .then((data) => {
      return _successResponse(200, data, callback);
    })
    .catch((err) => {
      return _raiseClientError(500, JSON.stringify(err), callback);
    });
};
