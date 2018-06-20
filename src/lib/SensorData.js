/**
 * SensorData class for CRUD operations
 * @class
 * @param {Object} config - default parameters for sensors framework
 * @param {Object} pool - database connection pool
 * @return {Object} Function methods
 **/
export default class SensorData {
  /**
   * constructor for class SensorData
   * @param {Object} config - Lambda configuration object
   * @param {Object} pool - Database connection pool
   */
  constructor(config, pool) {
    this.config = config;
    this.pool = pool;
  }

  /**
   * Gets sensor data from database
   * @method get
   * @param {Object} properties - Query properties
   * @param {Number} properties.id - Sensor identifier
   * @param {String} properties.type - Optional measurement type
   * @return {Promise} - Response from database
   */
  get(properties) {
    // Query string
    const query = `SELECT id as "dataId", sensor_id as "sensorId", 
    created, properties 
    FROM ${this.config.TABLE_SENSOR_DATA}
    WHERE sensor_id = $1 AND
      ($2::varchar IS NULL or properties->>'type' = $2::varchar)
    ORDER BY created ASC LIMIT 1;`;

    return new Promise((resolve, reject) => {
      this.pool.query(query, [properties.id, properties.type])
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

  /**
   * Inserts new sensor data into database
   * @method insert
   * @param {Number} id - Sensor identifier
   * @param {Object} properties - New data
   * @return {Promise} - Response from database
   */
  insert(id, properties) {
    // Query string
    const query = `INSERT INTO ${this.config.TABLE_SENSOR_DATA}
    (sensor_id, properties)
    VALUES ($1, $2::json)
    RETURNING id as "dataId", sensor_id as "sensorId", created`;

    return new Promise((resolve, reject) => {
      this.pool.query(query, [id, properties])
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

    /**
   * Deletes sensor data from database
   * @method delete
   * @param {Number} id - Sensor identifier
   * @param {Number} dataId - Data record identifier
   * @return {Promise} - Response from database
   */
  delete(id, dataId) {
    // Query string
    const query = `DELETE FROM ${this.config.TABLE_SENSOR_DATA}
    WHERE sensor_id = $1 AND id = $2`;

    return new Promise((resolve, reject) => {
      this.pool.query(query, [id, dataId])
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }
}
