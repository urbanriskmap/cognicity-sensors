import Promise from 'bluebird';
// Import DBGeo
import dbgeo from 'dbgeo';

/**
 * getSensor object for getting sensor data
 * @param {Object} config - default parameters for sensors framework
 * @param {Object} pool - database connection pool
 * @return {Object} Function methods
 **/
export default function(config, pool) {
  let methods = {};
  /**
    * Validates incoming query parameters from request
    * @function _validateParams
    * @param {Object} query - URL query
    * @return {String} - Type of message
  **/
  methods._validateParams = function(query) {
    // TODO
  };

  /**
    * Validates incoming bounding box parameters from request
    * @function _validateBBOX
    * @param {Object} bounds - bounds
    * @return {String} - Type of message
  **/
  methods._validateBounds = function(query) {
    // TODO
  };

  /**
    * Process incoming message and issue reply message if required
    * @function process
    * @param {Object} event - Event object
    * @return {Object} - Promise that all messages issued
  **/
  methods.getData = () => new Promise((resolve, reject) => {

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
                reject(err);
              }
              // Return result
              resolve(parsed);
            })
          })
          .catch(err => {
            client.release(); // !Important - release the client to the pool
            reject(err);
          })
      })
  });
  return methods;
}
