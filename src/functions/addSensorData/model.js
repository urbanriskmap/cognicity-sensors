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
    * @param {Number} sensorId - ID of sensor to update
    * @param {Array} properties - Sensor properties
    * @return {Object} - Promise that all messages issued
    */
  methods.postData = (sensorId, properties) => new Promise(
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
        let query = `INSERT INTO ${config.TABLE_SENSOR_DATA}
                    (properties, ${config.GEO_COLUMN})
                    VALUES ($2)
                    WHERE sensor_id = $1
                    RETURNING sensor_id, created`;

        // Query
        return client.query(query, [sensorId, properties])
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
