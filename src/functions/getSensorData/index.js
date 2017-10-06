import {Pool} from 'pg'; // Postgres
import getSensorData from './model';
import validate from '../../lib/validate';
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
  body: JSON.stringify(err),
});

/**
 * Endpoint for sensor objects
 * @function sensors
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Object} callback - Callback (HTTP response)
 */
export default (event, context, callback) => {
  // Don't wait to exit loop
  context.callbackWaitsForEmptyEventLoop = false;

  let err = null;
  let geoformat = null;

  if (event.queryStringParameters) {
    if (event.queryStringParameters.geoformat) {
      geoformat = event.queryStringParameters.geoformat;
    }
  }

  err, geoformat = validate(config).geoFormat(geoformat);
  if (err) {
    _raiseClientError(400, err, callback);
  }

  getSensorData(config, pool).getData(context.resourcePath, geoformat)
    .then((data) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(data),
      });
    })
    .catch((err) => {
      _raiseClientError(500, JSON.stringify(err), callback);
    });
};
