import * as test from 'unit.js';
import postSensor from '../functions/postSensor/index';

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
      postSensor(event, context, function(err, response) {
        test.value(response.statusCode).is(400);
        test.value(response.body)
          .is(`Requires sensor properties and location`);
        done();
      });
    });
    it('Catches missing properties', function(done) {
      let event = {};
      let context = {};
      event.body = {location: {lat: 1, lon: 2}, properties: null};
      postSensor(event, context, function(err, response) {
        test.value(response.statusCode).is(400);
        test.value(response.body)
          .is(`child "properties" fails because ` +
              `["properties" must be an object]`);
        done();
      });
    });
    it('Catches missing location', function(done) {
      let event = {};
      let context = {};
      event.body = {location: null, properties: {a: 1}};
      postSensor(event, context, function(err, response) {
        test.value(response.statusCode).is(400);
        test.value(response.body)
          .is(`child "location" fails because ["location" must be an object]`);
        done();
      });
    });
    it('Catches bad latitude', function(done) {
      let event = {};
      let context = {};
      event.body = {location: {lat: -91, lng: 0}, properties: {a: 1}};
      postSensor(event, context, function(err, response) {
        test.value(response.statusCode).is(400);
        test.value(response.body)
          .is(`child "location" fails because [child "lat" fails because ` +
              `["lat" must be larger than or equal to -90]]`);
        done();
      });
    });
    it('Catches bad latitude', function(done) {
      let event = {};
      let context = {};
      event.body = {location: {lat: 1, lng: -181}, properties: {a: 1}};
      postSensor(event, context, function(err, response) {
        test.value(response.statusCode).is(400);
        test.value(response.body)
          .is(`child "location" fails because [child "lng" fails because ` +
              `["lng" must be larger than or equal to -180]]`);
        done();
      });
    });
  });
}
