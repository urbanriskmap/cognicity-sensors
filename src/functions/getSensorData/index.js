import {Pool} from 'pg'; // Postgres
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
// Return an error in Lambda format
const _raiseClientError = (code, err, callback) => callback(null, {
  statusCode: code,
  body: err,
});

const _successResponse = (code, body, callback) => callback(null, {
  statusCode: code,
  body: body,
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
 * @return {Object} response - HTTP response
 */
export default (event, context, callback) => {
  // Don't wait to exit loop
  context.callbackWaitsForEmptyEventLoop = false;
  // validate sensor/:id
  let sensorId = Joi.validate(event.path, _pathSchema);
  if (sensorId.error) {
    return _raiseClientError(400, sensorId.error.message, callback);
  }
  pool.connect()
    .then((client) => {
      console.log('Now execute the query from the client');
      let query = `SELECT * FROM ${config.TABLE_SENSOR_DATA}
                  WHERE sensor_id = $1 ORDER BY created ASC`;
      console.log(query);
      console.log(sensorId);
      const id = sensorId.id;
      // Query
      client.query(query, [id])
        .then((result) => {
          client.release(); // !Important - release the client to the pool
          console.log(`${result.rows.length} results found`);
            // Return result
            return _successResponse(200, result.rows, callback);
        })
        .catch((err) => {
          client.release(); // !Important - release the client to the pool
          return _raiseClientError(500, JSON.stringify(err.message), callback);
        });
    });
};
