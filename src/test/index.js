/* eslint-disable no-console*/
/**
  * Unit tests for CogniCity Sensors endpoints
  * @file Runs unit tests for CogniCity Sensors
  *
  * Tomas Holderness October 2017
**/

import testGetSensors from './testGetSensors';
// import testGetSensorData from './testGetSensorData';
import testAddSensor from './testAddSensor';
import testAddSensorData from './testAddSensorData';
import testLibValidate from './testLibValidate';


/* import getSensors from '../functions/getSensors';
import getSensorData from '../functions/getSensorData';

getSensors(0,{'a':1},function(err, data){console.log(err, data)});
getSensorData(0,{},function(err, data){console.log(err, data)}); */
import config from '../config';

testLibValidate(config);
testGetSensors(config);
// testGetSensorData(config);
testAddSensor(config);
testAddSensorData(config);
