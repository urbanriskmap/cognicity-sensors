import config from '../../config';

// Import DB library
const { Pool } = require('pg');

// Connection object
const cn = `postgres://${config.PGUSER}:${config.PGPASSWORD}@${config.PGHOST}:${config.PGPORT}/${config.PGDATABASE}?ssl=${config.PGSSL}`;

// Create a pool object
const pool = new Pool({connectionString: cn});
pool.CREATED = Date.now(); // Smash this into the pool object
/**
 * Endpoint for sensor objects
 * @function sensors
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Object} callback - Callback (HTTP response)
 */
module.exports.sensors = (event, context, callback) => {

  // Don't wait to exit loop
  context.callbackWaitsForEmptyEventLoop = false;

  // Get a client from the pool
  console.log(pool.CREATED);
  pool.connect()
    .then(client => {
      // Query
      return client.query(`SELECT * FROM cognicity.version();`)
        .then(res => {
          client.release(); // !Important - release the client to the pool
          // Return result
          callback(null, {res: res.rows[0], pool_created: pool.CREATED});
        })
        .catch(e => {
          client.release(); // !Important - release the client to the pool
          console.log(e);
          callback(e, null);
        })
    })
}
