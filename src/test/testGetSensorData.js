import * as test from 'unit.js';
import getSensorData from '../functions/getSensorData/index';

/**
 * Sensor data model testing harness
 * @file Sensors tests
 * @param {Object} config - Sensors config parameter
 */
export default function(config) {
  describe('Get Sensor Data Handler Testing', function() {
    it('Rejects bad geoformat query parameter', function(done) {
      let event = {};
      let context = {};
      event.queryStringParameters = {geoformat: 'geoxml'};
      getSensorData(event, context, function(err, response) {
        test.value(response.statusCode).is(400);
        test.value(response.body)
          .is(`geo format value must be one of geojson,topojson`);
        done();
      });
    });
  });
}
