/**
 * CogniCity Sensor Lambdas configuration
 * @file config.js
 * @return {Object} Configuration
**/

require('dotenv').config({silent:true});

export default {
  PGHOST: process.env.PGHOST || '127.0.0.1',
  PGDATABASE: process.env.PGDATABASE || 'cognicity',
  PGPASSWORD: process.env.PGPASSWORD || 'p@ssw0rd',
  PGPORT: process.env.PGPORT || 5432,
  PGSSL: process.env.PGSSL === 'true' || false,
  PGTIMEOUT: process.env.PGTIMEOUT || 10000,
  PGUSER: process.env.PGUSER || 'postgres',
}
