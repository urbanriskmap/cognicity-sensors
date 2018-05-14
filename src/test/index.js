/**
  * Unit tests for CogniCity Sensors endpoints
  * @file Runs unit tests for CogniCity Sensors
  *
  * Tomas Holderness - October 2017
**/
import testSensors from './testSensors';
import testSensorData from './testSensorData';

import testIntegration from './testIntegration';

// Unit tests
testSensors();
testSensorData();
testIntegration();

// Integration tests
process.env.PG_PORT = 5433;

