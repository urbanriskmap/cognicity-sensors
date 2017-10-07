import * as test from 'unit.js';

import getSensors from '../functions/getSensors/model';

/**
 * Sensors model testing harness
 * @file Sensors tests
 */
export default function() {
  describe('Get Sensors Model Testing', function() {
    it('does something', function() {
      getSensors(0, {'a': 1}, function(err, data) {
        console.log(err, data);
      });
      test.value(1).is(1);
    });
  });
}
