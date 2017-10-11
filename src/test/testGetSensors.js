import * as test from 'unit.js';
import getSensors from '../functions/getSensors/index';

/**
 * Sensors model testing harness
 * @file Sensors tests
 * @param {Object} config - Sensors config parameter
 */
export default function(config) {
  describe('Get Sensors Handler Testing', function() {
    it('Rejects bad bbox query parameter', function(done) {
      let event = {};
      let context = {};
      event.queryStringParameters = {bounds: '1,2,3'};
      getSensors(event, context, function(err, response) {
        test.value(response.statusCode).is(400);
        test.value(response.body)
          .is(`"bounds" is not allowed`);
        done();
      });
    });
    it('Rejects bad bbox latitude value query parameter', function(done) {
      let event = {};
      let context = {};
      event.queryStringParameters = {bbox: '1,2,3,-181'};
      getSensors(event, context, function(err, response) {
        test.value(response.statusCode).is(400);
        test.value(response.body)
          .is(`"value" at position 3 does not match any of the allowed types`);
        done();
      });
    });
    it('Rejects bad geoformat query parameter', function(done) {
      let event = {};
      let context = {};
      event.queryStringParameters = {geoformat: 'geoxml'};
      getSensors(event, context, function(err, response) {
        test.value(response.statusCode).is(400);
        test.value(response.body)
          .is(`child "geoformat" fails because ` +
            `["geoformat" must be one of [geojson, topojson]]`);
        done();
      });
    });
  });
}
