import getSensors from '../functions/getSensors';
import getSensorData from '../functions/getSensorData';

getSensors(0,{'a':1},function(err, data){console.log(err, data)});
getSensorData(0,{},function(err, data){console.log(err, data)});
