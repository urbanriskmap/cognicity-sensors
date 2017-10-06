import config from '../../config';
import getSensors from './getSensors';

// Import DB library
import { Pool } from 'pg';

// Connection object
const cn = `postgres://${config.PGUSER}:${config.PGPASSWORD}@${config.PGHOST}:${config.PGPORT}/${config.PGDATABASE}?ssl=${config.PGSSL}`;

// Create a pool object
const pool = new Pool({connectionString: cn});
pool.CREATED = Date.now(); // Smash this into the pool object

// Output config
const dbGeoConfig = {
  geometryColumn: 'the_geom',
  outputFormat: 'geojson',
  precision: '8',
}

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

  // Catch database errors
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    callback(err);
  });

  // TODO support topojson?

  // TODO - reject if bounds are garbage?
  // bounds = getSensors(dbGeoConfig, // pool)._validateBounds(event.queryStringParameters);
  //.then(callback with error)

  getSensors(dbGeoConfig, pool).getData(bounds)
    .then((data) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(data)
      })
    })
    .catch((err) => {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify(err)
      })
    });
}
