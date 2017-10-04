import config from '../../config';

// Import DB library
import { Pool } from 'pg';

// Import DBGeo
import dbgeo from 'dbgeo';

// Connection object
const cn = `postgres://${config.PGUSER}:${config.PGPASSWORD}@${config.PGHOST}:${config.PGPORT}/${config.PGDATABASE}?ssl=${config.PGSSL}`;

// Create a pool object
// TODO add timeout here for testing
const pool = new Pool({connectionString: cn});
pool.CREATED = Date.now(); // Smash this into the pool object

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

  // Output config
  let dbGeoConfig = {
    geometryColumn: 'the_geom',
    outputFormat: 'geojson',
    precision: '8',
  }

  // Process query params
  let query = event.queryStringParameters;
  let bbox;

  if (query && query.bbox){
    // Do some validation of bbox
    bbox = query.bbox;
  }

  if (query && query.format) {
    if (format === 'topojson'){
      dbGeoConfig.outputFormat = 'topojson';
    }
  }

  // Catch database errors
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    callback(err);
  });

  // Get a client from the pool
  pool.connect()
    .then(client => {
      // Query
      return client.query(`SELECT * FROM sensors.metadata;`)
        .then(result => {
          client.release(); // !Important - release the client to the pool
          console.log(`${result.rows.length} results found`);
          dbgeo.parse(result.rows, config, (err, parsed) => {
            if (err){
              console.error(err);
              callback(err);
            }
            // Return result
            callback(null, {
              statusCode: 200,
              body: JSON.stringify(parsed)
            })
          })
        })
        .catch(err => {
          client.release(); // !Important - release the client to the pool
          console.error(err);
          callback(err);
        })
    })
  }
