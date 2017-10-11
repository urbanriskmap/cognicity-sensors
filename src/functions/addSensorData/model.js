import Promise from 'bluebird'; // Promises

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
    // Get a client from the pool
    pool.connect()
      .then((client) => {
        let query = `INSERT INTO ${config.TABLE_SENSOR_DATA}
                    (sensor_id, properties)
                    VALUES ($1, $2::json)
                    RETURNING sensor_id, created`;
        console.log(query);
        console.log([sensorId, properties]);
        // Query
        return client.query(query, [sensorId, properties])
          .then((result) => {
            client.release(); // !Important - release the client to the pool
              // Return result
              resolve(result.rows);
          })
          .catch((err) => {
            client.release(); // !Important - release the client to the pool
            reject(err);
          });
      });
  });
  return methods;
}
