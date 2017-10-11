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
    * Process incoming message and issue reply message if required
    * @function process
    * @param {Object} id - Sensor id
    * @param {Object} geoformat - output format type
    * @return {Object} - Promise that all messages issued
  **/
  methods.getData = (id) => new Promise((resolve, reject) => {
    // Get a client from the pool
    console.log(id);
    pool.connect()
      .then((client) => {
        let query = `SELECT * FROM ${config.TABLE_SENSOR_DATA}
                    WHERE sensor_id = $1`;
        console.log(query);
        console.log(id);
        // Query
        return client.query(query, [id])
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
