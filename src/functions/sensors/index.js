import Promise from 'bluebird';

import config from '../../config';

// Import DB library
const pgp = require('pg-promise')({
  // Initialization Options
  promiseLib: Promise, // Use bluebird for enhanced Promises
});

// Connection object
const cn = `postgres://${config.PGUSER}:${config.PGPASSWORD}@${config.PGHOST}:${config.PGPORT}/${config.PGDATABASE}?ssl=${config.PGSSL}`;


/**
 * Endpoint for sensor objects
 * @function sensors
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Object} callback - Callback (HTTP response)
 */
module.exports.sensors = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;

  const db = pgp(cn);

  let query = `SELECT * FROM cognicity.version()`;

  db.oneOrNone(query).timeout(config.PGTIMEOUT)
    .then((res) => {
      console.log(res);
      callback(null, res);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
}
