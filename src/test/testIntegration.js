import * as test from 'unit.js';

// Locals
import addSensor from '../functions/addSensor';
import getSensors from '../functions/getSensors';
import addSensorData from '../functions/addSensorData';
import getSensorData from '../functions/getSensorData';
// import deleteSensorData from '../functons/deleteSensorData';

import config from '../config';

/**
 * Sensor class testing
 */
export default function() {
    describe('Sensor functions integration testing', function() {
        it('Catches bad input', function(done) {
            addSensor({body: JSON.stringify({})}, {}, function(err, response) {
                const body = JSON.parse(response.body);
                test.value(err).is(null);
                test.value(response.headers).is({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                });
                test.value(body.statusCode).is(400);
                test.value(body.result.message).is('"properties" is required');
                done();
            });
        });
        it('Can add sensor', function(done) {
            const sensor = {
                properties: {
                    name: 'test',
                },
                location: {
                    lat: 90,
                    lng: 100,
                },
            };
            addSensor({body: JSON.stringify(sensor)}, {}, function(err, response) {
                const body = JSON.parse(response.body);
                test.value(err).is(null);
                test.value(response.headers).is({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                });
                test.value(body.statusCode).is(200);
                test.value(body.result.properties.name).is('test');
                done();
            });
        });
        it('Can add data to a sensor', function(done) {
            const data = {
                properties: {
                    METAR: `CYYQ 182200Z 07002KT 15SM OVC017 06/03 A2966 RMK SC10 3 POLAR BEARS ALNG RNWY== `,
                },
            };
            addSensorData({body: JSON.stringify(data), pathParameters: JSON.stringify({id:1})}, {}, function(err, response) {
                const body = JSON.parse(response.body);
                console.log(body);
                test.value(err).is(null);
                test.value(response.headers).is({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                });
                test.value(body.statusCode).is(200);
                done();
            });
        });
    });
}

