import * as test from 'unit.js';

import validate from '../lib/validate';

/**
 * Validation methods testing harness
 * @file Sensors tests
 * @param {Object} config - Sensors configuration object
 */
export default function(config) {
  describe('Bounds validation method testing', function() {
    it('catches less than 4 bounds params', function() {
      let bounds = validate(config).bounds('1,2,3');
      test.value(bounds.err)
        .is(`bbox value must be in format xmin,ymin,xmax,ymax`);
      test.value(bounds.value).is(null);
    });
    it('catches longitude < -180', function() {
      let bounds = validate(config).bounds('-181,2,3,4');
      test.value(bounds.err).is('bbox values out of range');
      test.value(bounds.value).is(null);
    });
    it('catches longitude > 180', function() {
      let bounds = validate(config).bounds('181,2,3,4');
      test.value(bounds.err).is('bbox values out of range');
      test.value(bounds.value).is(null);
    });
    it('catches latitude < -90', function() {
      let bounds = validate(config).bounds('180,-91,3,4');
      test.value(bounds.err).is('bbox values out of range');
      test.value(bounds.value).is(null);
    });
    it('catches latitude > 90', function() {
      let bounds = validate(config).bounds('180,91,3,4');
      test.value(bounds.err).is('bbox values out of range');
      test.value(bounds.value).is(null);
    });
    it('can process valid bounds', function() {
      let bounds = validate(config).bounds('1.02,54.5,0.9,55.6');
      test.value(bounds.err).is(null);
      test.value(bounds.value).is([1.02, 54.5, 0.9, 55.6]);
    });
    it('returns default bounds', function() {
      let bounds = validate(config).bounds(null);
      test.value(bounds.err).is(null);
      test.value(bounds.value).is([-180, -90, 180, 90]);
    });
  });
  describe('Geoformat validation method testing', function() {
    it('returns default format', function() {
      let bounds = validate(config).geoFormat(null);
      test.value(bounds.err).is(null);
      test.value(bounds.value).is(config.GEO_FORMAT_DEFAULT);
    });
    it('catches incorrect formats', function() {
      let bounds = validate(config).geoFormat('geoxml');
      test.value(bounds.err)
        .is(`geo format value must be one of geojson,topojson`);
      test.value(bounds.value).is(null);
    });
    it('returns a valid format', function() {
      let bounds = validate(config).geoFormat('topojson');
      test.value(bounds.err)
        .is(null);
      test.value(bounds.value).is('topojson');
    });
  });
}
