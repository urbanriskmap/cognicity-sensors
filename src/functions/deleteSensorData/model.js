import Promise from 'bluebird'; // Promises

/**
 * deleteSensorData object for deleting sensor data
 * @param {Object} config - default parameters for sensors framework
 * @param {Object} pool - database connection pool
 * @return {Object} Function methods
 **/
export default function(config, pool) {
  let methods = {};
  /**
    * Delete data specified by primary key and sensor id.
    * @function process
    * @param {Object} sensorId - Sensor id
    * @param {Object} dataId - row id for data to be deleted
    * @return {Object} - Promise that all messages issued
  **/
  methods.deleteData = (sensorId, dataId) => new Promise((resolve, reject) => {
    pool.connect()
      .then((client) => {
        let query = `DELETE FROM ${config.TABLE_SENSOR_DATA}
                    WHERE sensor_id = $1 AND id = $2`;
        // Query
        return client.query(query, [sensorId, dataId])
          .then((result) => {
            client.release(); // !Important - release the client to the pool
            console.log(`${result.rows.length} results found`);
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
