import * as test from 'unit.js';
import addSensorData from '../functions/addSensorData/index';

/**
 * Post sensor data model testing harness
 * @file Sensors tests
 * @param {Object} config - Sensors config parameter
 */
export default function(config) {
  describe('Post Sensor Data Handler Testing', function() {
    it('Rejects if body not present', function(done) {
      let event = {};
      let context = {};
      event.body = null;
      addSensorData(event, context, function(err, response) {
        test.value(response.statusCode).is(400);
        test.value(response.body)
          .is(`Requires sensor properties and location`);
        done();
      });
    });
    it('Catches missing properties', function(done) {
      let event = {};
      let context = {};
      event.body = JSON.stringify({location: {lat: 1, lon: 2},
        properties: null});
      addSensorData(event, context, function(err, response) {
        test.value(response.statusCode).is(400);
        test.value(response.body)
          .is(`child "properties" fails because ` +
              `["properties" must be an object]`);
        done();
      });
    });
    it('Catches invalid resource path', function(done) {
      let event = {};
      let context = {resourcePath: {id: -1}};
      event.body = JSON.stringify({properties: {a: 1}});
      addSensorData(event, context, function(err, response) {
        test.value(response.statusCode).is(400);
        test.value(response.body)
          .is(`child "id" fails because ` +
              `["id" must be larger than or equal to 1]`);
        done();
      });
    });
  });
}
