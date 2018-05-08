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
   * @param {Number} id - Sensor identifier
   * @return {Promise} - Response from database
   */
  get(id) {
    // Query string
    const query = `SELECT * FROM ${this.config.TABLE_SENSOR_DATA}
    WHERE sensor_id = $1 ORDER BY created ASC LIMIT 1;`;

    return new Promise((resolve, reject) => {
      this.pool.query(query, [id])
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
    RETURNING sensor_id, created`;

    return new Promise((resolve, reject) => {
      this.pool.query(query, [id, properties])
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }
}
