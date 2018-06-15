import {Pool} from 'pg'; // Postgres
import Joi from 'joi'; // validation

// Local objects
import config from '../../config';
import {handleResponse} from '../../lib/util';
import Sensors from '../../lib/Sensors';

// Connection object
const cn = `postgres://${config.PGUSER}:${config.PGPASSWORD}@${config.PGHOST}:${config.PGPORT}/${config.PGDATABASE}?ssl=${config.PGSSL}`;

// Create a pool object
const pool = new Pool({
  connectionString: cn,
  idleTimeoutMillis: config.PG_CLIENT_IDLE_TIMEOUT,
});

// Validation schema
const _propertiesSchema = Joi.object().keys({
  bbox: Joi.array().length(4).items(
    Joi.number().min(-180).max(180),
    Joi.number().min(-90).max(90),
    Joi.number().min(-180).max(180),
    Joi.number().min(-90).max(90)
  ).default(config.GEO_EXTENTS_DEFAULT),
  geoformat: Joi.string().default(config.GEO_FORMAT_DEFAULT)
    .valid(config.GEO_FORMATS),
  agency: Joi.string(),
});

/**
 * Endpoint for sensor objects
 * @function getSensors
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Object} callback - Callback (HTTP response)
 */
export default async (event, context, callback) => {
  try {
    // Catch database errors
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err);
    });

    // Set defaults for optional query params
    // TODO - refactor this into something readable
    const defaults = {
      bbox: (!!event.queryStringParameters &&
        !!event.queryStringParameters.bbox &&
        event.queryStringParameters.bbox ||
        config.GEO_EXTENTS_DEFAULT).split(','),
      geoformat: !!event.queryStringParameters &&
        !!event.queryStringParameters.geoformat &&
        event.queryStringParameters.geoformat ||
        config.GEO_FORMAT_DEFAULT,
      agency: !!event.queryStringParameters.agency &&
      event.queryStringParameters.agency || 'null',
    };

    console.log(defaults);

    // Validate
    const properties = await Joi.validate(defaults, _propertiesSchema);

    // Sensor class
    const sensor = new Sensors(config, pool);

    // Get sensor data, and return
    const result = await sensor.all(properties);
    handleResponse(callback, 200, result);
  } catch (err) {
    if (err.isJoi) {
handleResponse(callback, 400,
      {message: err.details[0].message} );
} else handleResponse(callback, 500, err.message);
  }
};
