import * as test from 'unit.js';
import deleteSensorData from '../functions/deleteSensorData/index';

/**
 * Delete sensor data model testing harness
 * @file Sensors tests
 * @param {Object} config - Sensors config parameter
 */
export default function(config) {
  describe('Delete Sensor Data Handler Testing', function() {
    it('Rejects if body not present', function(done) {
      let event = {};
      let context = {};
      event.body = null;
      deleteSensorData(event, context, function(err, response) {
        test.value(response.statusCode).is(400);
        test.value(response.body)
          .is(`"value" must be an object`);
        done();
      });
    });
    it('Catches missing properties', function(done) {
      let event = {};
      let context = {};
      event.body = JSON.stringify({data_id: null});
      deleteSensorData(event, context, function(err, response) {
        test.value(response.statusCode).is(400);
        test.value(response.body)
          .is(`child "data_id" fails because ` +
              `["data_id" must be a number]`);
        done();
      });
    });
    it('Catches invalid resource path', function(done) {
      let event = {path: {id: 0}};
      let context = {};
      event.body = JSON.stringify({data_id: 1});
      deleteSensorData(event, context, function(err, response) {
        test.value(response.statusCode).is(400);
        test.value(response.body)
          .is(`child "id" fails because ` +
              `["id" must be larger than or equal to 1]`);
        done();
      });
    });
  });
}
