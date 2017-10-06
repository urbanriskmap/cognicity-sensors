import Promise from 'bluebird'; // Promises
import dbgeo from 'dbgeo'; // PostGIS

/**
 * getSensor object for getting sensor data
 * @param {Object} config - default parameters for sensors framework
 * @param {Object} pool - database connection pool
 * @return {Object} Function methods
 **/
export default function(config, pool) {
  let methods = {};

  /**
    * Process incoming message and issue reply message if required
    * @function process
    * @param {Array} bounds - Bounding box (xmin, ymin, xmax, ymax)
    * @param {String} geoformat - Output geoformat
    * @return {Object} - Promise that all messages issued
  **/
  methods.getData = (bounds, geoformat) => new Promise((resolve, reject) => {
    let _defaults = {
      outputFormat: geoformat,
      geometryColumn: config.GEO_COLUMN,
      geometryType: 'wkb',
      precision: config.GEO_PRECISION,
    };

    // Get a client from the pool
    pool.connect()
      .then((client) => {
        let query = `SELECT * FROM ${config.TABLE_SENSOR_METADATA}
                    WHERE ( ${config.GEO_COLUMN} @ ST_MakeEnvelope($1, $2, $3,
                      $4, ${config.GEO_SRID}))`;

        // Query
        return client.query(query, bounds)
          .then((result) => {
            client.release(); // !Important - release the client to the pool
            console.log(`${result.rows.length} results found`);
            dbgeo.parse(result.rows, _defaults, (err, parsed) => {
              if (err) {
                reject(err);
              }
              // Return result
              resolve(parsed);
            });
          })
          .catch((err) => {
            client.release(); // !Important - release the client to the pool
            reject(err);
          });
      });
  });
  return methods;
}
