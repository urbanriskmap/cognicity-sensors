import {Pool} from 'pg'; // Postgres
import Joi from 'joi'; // validation

// Local objects
import config from '../../config';
import Sensors from '../../lib/Sensors';

// Connection object
const cn = `postgres://${config.PGUSER}:${config.PGPASSWORD}@${config.PGHOST}:${config.PGPORT}/${config.PGDATABASE}?ssl=${config.PGSSL}`;

// Create a pool object
const pool = new Pool({
  connectionString: cn,
  idleTimeoutMillis: config.PG_CLIENT_IDLE_TIMEOUT,
});

const _schema = Joi.object().keys({
  properties: Joi.object().min(1).required(),
  location: Joi.object().required().keys({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
  }),
});

/**
 * Endpoint for sensor objects
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

  // Validate URL params
  Joi.validate(event.body, _schema,
    function(err, result) {
    if (err) {
      console.log(err);
      callback( null, {
        statusCode: 400,
        body: JSON.stringify(err.message),
      });
    }
  });

    // Sensor class
    const sensor = new Sensors(config, pool);

    // Call database
    sensor.insert(event.body.properties, event.body.location)
    .then((result) => {
      console.log('Added sensor');
      callback(null, {statusCode: 200, body: JSON.stringify(result.rows)});
    })
    .catch((err) => {
      console.log('Error adding sensor: ' + err.message);
      callback(null, {statusCode: 500, body: JSON.stringify(err.message)});
    });
};
