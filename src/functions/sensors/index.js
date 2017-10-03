import Promise from 'bluebird';

import config from '../../config';

// Import DB library
const pgp = require('pg-promise')({
  // Initialization Options
  promiseLib: Promise, // Use bluebird for enhanced Promises
});

// Connection object
const cn = `postgres://${config.PGUSER}:${config.PGPASSWORD}@${config.PGHOST}:${config.PGPORT}/${config.PGDATABASE}?ssl=${config.PGSSL}`;

// Global db object shared between functions
const db = pgp(cn);

/**
 * Endpoint for sensor objects
 * @function sensors
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Object} callback - Callback (HTTP response)
 */
module.exports.sensors = (event, context, callback) => {

  let query = `SELECT * FROM cognicity.version()`;

  db.oneOrNone(query).timeout(config.PGTIMEOUT)
    .then((res) => {
      console.log(res);
      db.$pool.end();
      callback(null, res);
    })
    .catch((err) => {
      console.log(err);
      db.$pool.end();
      callback(err);
    });
}
