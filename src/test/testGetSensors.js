import * as test from 'unit.js';

import getSensors from '../functions/getSensors/model';

export default function(){
  describe('Get Sensors Model Testing', function(){
    it('does something', function(){
      getSensors(0,{'a':1},function(err, data){console.log(err, data)});
    })
  })
}
