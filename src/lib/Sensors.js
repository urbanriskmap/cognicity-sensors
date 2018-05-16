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
      this.dbgeo = dbgeo;
    }

    /**
     * Gets all sensors from database
     * @method all
     * @param {Object} properties - Query parameters
     * @param {Object} properties.bbox - Bounding box (xmin, ymin, xmax, ymax)
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
        this.pool.query(query, properties.bbox)
          .then((result) => {
            this.dbgeo.parse(result.rows, params, (err, parsed) => {
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
     * @param {Object} properties - Sensor metadata
     * @param {Object} location - Sensor location
     * @param {Number} location.lat - Latitude
     * @param {Numver} location.lng - Longitude
     * @return {Promise} - Response from database
     */
    insert(properties, location) {
      // DBGeo params
      const params = {
        outputFormat: this.config.GEO_FORMAT_DEFAULT,
        geometryColumn: this.config.GEO_COLUMN,
        geometryType: 'wkb',
        precision: this.config.GEO_PRECISION,
      };
      // Query string
      const query = `INSERT INTO ${this.config.TABLE_SENSOR_METADATA}
      (properties, ${this.config.GEO_COLUMN})
      VALUES ($1, ST_SetSRID(ST_Point($2,$3), ${this.config.GEO_SRID}))
      RETURNING id, created, properties, the_geom`;

      return new Promise((resolve, reject) => {
        this.pool.query(query, [properties, location.lng, location.lat])
          .then((result) => {
            this.dbgeo.parse(result.rows, params, (err, parsed) => {
              if (err) {
                reject(err);
              }
              resolve(parsed);
            });
          })
          .catch((err) => reject(err));
      });
    }
  }
