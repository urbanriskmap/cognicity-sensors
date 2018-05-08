import dbgeo from 'dbgeo'; // PostGIS support

/**
 * Sensors class for CRUD operations
 * @class
 * @param {Object} config - default parameters for sensors framework
 * @param {Object} pool - database connection pool
 * @return {Object} Function methods
 **/
export default class Sensors {
    /**
     * constructor for class Sensor
     * @param {Object} config - Lambda configuration object
     * @param {Object} pool - Database connection pool
     */
    constructor(config, pool) {
      this.config = config;
      this.pool = pool;
    }

    /**
     * Gets all sensors from database
     * @method all
     * @param {Object} properties - Query parameters
     * @param {Object} properties.bounds - Bounding box (xmin, ymin, xmax, ymax)
     * @param {Object} properties.geoformat - Output geoformat
     * @return {Promise} - Response from database
     */
    all(properties) {
      const params = {
          outputFormat: properties.geoformat,
          geometryColumn: this.config.GEO_COLUMN,
          geometryType: 'wkb',
          precision: this.config.GEO_PRECISION,
      };

      // Query string
      const query = `SELECT * FROM ${this.config.TABLE_SENSOR_METADATA}
      WHERE ( ${this.config.GEO_COLUMN} @ ST_MakeEnvelope($1, $2, $3,
        $4, ${this.config.GEO_SRID}))`;

      return new Promise((resolve, reject) => {
        this.pool.query(query, [properties.bounds])
          .then((result) => {
            dbgeo.parse(result.rows, params, (err, parsed) => {
              if (err) {
                reject(err);
              }
              resolve(parsed);
            });
          })
          .catch((err) => reject(err));
      });
    }

    /**
     * Inserts new Sensors into database
     * @method insert
     * @param {Number} id - Sensors identifier
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
