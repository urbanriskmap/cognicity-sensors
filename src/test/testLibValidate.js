import * as test from 'unit.js';

import validate from '../lib/validate';

/**
 * Validation methods testing harness
 * @file Sensors tests
 * @param {Object} config - Sensors configuration object
 */
export default function(config) {
  describe('Validation methods testing', function() {
    it('catches less than 4 bounds params', function() {
      let err = null;
      let bounds = null;
      err = validate(config).bounds('1,2,3');
      test.value(err).is('bbox value must be in format xmin,ymin,xmax,ymax');
      test.value(bounds).is(null);
    });
    it('catches longitude < -180', function() {
      let err = null;
      let bounds = null;
      err = validate(config).bounds('-181,2,3,4');
      test.value(err).is('bbox values out of range');
      test.value(bounds).is(null);
    });
    it('catches longitude > 180', function() {
      let err = null;
      let bounds = null;
      err = validate(config).bounds('181,2,3,4');
      test.value(err).is('bbox values out of range');
      test.value(bounds).is(null);
    });
    it('catches latitude < -90', function() {
      let err = null;
      let bounds = null;
      err = validate(config).bounds('180,-91,3,4');
      test.value(err).is('bbox values out of range');
      test.value(bounds).is(null);
    });
    it('catches latitude > 90', function() {
      let err = null;
      let bounds = null;
      err = validate(config).bounds('180,91,3,4');
      test.value(err).is('bbox values out of range');
      test.value(bounds).is(null);
    });
    it('can process valid bounds', function() {
      let err = null;
      let bounds = null;
      err = validate(config).bounds('-1.02,94.5,-0.9,95.6');
      test.value(err).is('bbox values out of range');
      test.value(bounds).is(null);
    });
  });
}
