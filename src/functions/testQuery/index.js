import {Pool} from 'pg'; // Postgres
import Joi from 'joi'; // validation
import config from '../../config';

// Connection object
const cn = `postgres://${config.PGUSER}:${config.PGPASSWORD}@${config.PGHOST}:${config.PGPORT}/${config.PGDATABASE}?ssl=${config.PGSSL}`;

// Create a pool object
const pool = new Pool({connectionString: cn});

// Catch database errors
// TODO pass this back to Lambda
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

/**
 * Endpoint for sensor objects
 * @function sensors
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Object} callback - Callback (HTTP response)
 * @return {Object} response - HTTP response
 */
export default (event, context, callback) => {
  // Don't wait to exit loop
  //context.callbackWaitsForEmptyEventLoop = true;

  const query = {
    // give the query a unique name
    name: 'test-query',
    text: `SELECT * FROM ${config.TABLE_SENSOR_DATA}
    WHERE sensor_id = $1 ORDER BY created ASC;`,
    values: [54]
  }

  // TODO - transactional?
  /*pool.query(`SET SESSION idle_in_transaction_session_timeout = '1min'`)
    .then((res) => {
        console.log('Set timeout');
    }).catch((err) => {
        console.log('Error setting timeout');
    });*/

  pool.query(query)
    .then((result) => {
      console.log(`${result.rows.length} results found`);
      callback(null, {
        statusCode: 200,
        body: result.rows,
      });
    }).catch((err) => {
      console.log(err.message);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify(err.message),
      });
    });
};
