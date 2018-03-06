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
    * Add sensor to database
    * @function process
    * @param {Array} properties - Sensor properties
    * @param {String} location - Location object {lat, lng}
    * @return {Object} - Promise that all messages issued
    */
  methods.postData = (properties, location) => new Promise(
    (resolve, reject) => {
    let _defaults = {
      outputFormat: config.GEO_FORMAT_DEFAULT,
      geometryColumn: config.GEO_COLUMN,
      geometryType: 'wkb',
      precision: config.GEO_PRECISION,
    };

    // Get a client from the pool
    pool.connect()
      .then((client) => {
        let query = `INSERT INTO ${config.TABLE_SENSOR_METADATA}
                    (properties, ${config.GEO_COLUMN})
                    VALUES ($1, ST_SetSRID(ST_Point($2,$3), ${config.GEO_SRID}))
                    RETURNING id, created, properties, the_geom`;

        // Query
        return client.query(query, [properties, location.lng, location.lat])
          .then((result) => {
            client.release(); // !Important - release the client to the pool
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
