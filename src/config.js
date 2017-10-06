/**
 * CogniCity Sensor Lambdas configuration
 * @file config.js
 * @return {Object} Configuration
**/

require('dotenv').config({silent:true});

export default {
  PGHOST: process.env.PGHOST || '127.0.0.1',
  PGDATABASE: process.env.PGDATABASE || 'cognicity',
  PGPASSWORD: process.env.PGPASSWORD || 'password',
  PGPORT: process.env.PGPORT || 5432,
  PGSSL: process.env.PGSSL === 'true' || false,
  PGTIMEOUT: process.env.PGTIMEOUT || 10000,
  PGUSER: process.env.PGUSER || 'postgres',
  GEO_COLUMN: process.env.GEO_COLUMN || 'the_geom',
  GEO_FORMAT_DEFAULT: process.env.GEO_FORMAT_DEFAULT || 'geojson',
  GEO_FORMATS: (process.env.GEO_FORMATS || 'geojson,topojson').split(','),
  GEO_PRECISION: process.env.GEO_PRECISION || 10,
  GEO_SRID: process.env.GEO_SRID || 4326,
  TABLE_SENSOR_METADATA: process.env.TABLE_SENSOR_METADATA || 'sensors.metadata',
  TABLE_SENSOR_DATA: process.env.TABLE_SENSOR_DATA || 'sensors.data'
}