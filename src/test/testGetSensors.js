import * as test from 'unit.js';

import getSensors from '../functions/getSensors/index';

/**
 * Sensors model testing harness
 * @file Sensors tests
 * @param {Object} config - Sensors config parameter
 */
export default function(config) {
  describe('Get Sensors Model Testing', function() {
    it('Rejects bad bounds query parameter', function(done) {
      let event = {};
      let context = {};
      event.queryStringParameters = {bounds: '1,2,3'};
      getSensors(event, context, function(err, response) {
        test.value(response.statusCode).is(400);
        test.value(response.body)
          .is(`bbox value must be in format xmin,ymin,xmax,ymax`);
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
          .is(`geo format value must be one of geojson,topojson`);
        done();
      });
    });
  });
}
