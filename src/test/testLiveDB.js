/* eslint max-len: "off" */
import * as test from 'unit.js';

// Locals
import addSensor from '../functions/addSensor';
import getSensors from '../functions/getSensors';
import addSensorData from '../functions/addSensorData';
import getSensorData from '../functions/getSensorData';
import deleteSensorData from '../functions/deleteSensorData';

/**
 * Sensor class testing
 */
export default function() {
    describe('Sensor functions integration testing', function() {
        let DATAID = 1;
        it('addSensor() - catches bad new sensor input', function(done) {
            addSensor({body: JSON.stringify({})}, {}, function(err, response) {
                const body = JSON.parse(response.body);
                test.value(err).is(null);
                test.value(response.headers).is({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                });
                test.value(body.statusCode).is(400);
                test.value(body.result).is('"properties" is required');
                done();
            });
        });
        it('addSensor() - can add sensor', function(done) {
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
                test.value(body.result.type).is('FeatureCollection');
                done();
            });
        });
        it('addSensorData() - can add data to a sensor', function(done) {
            const data = {
                properties: {
                    METAR: `CYYQ 182200Z 07002KT 15SM OVC017 06/03 A2966 RMK SC10 3 POLAR BEARS ALNG RNWY== `,
                },
            };
            addSensorData({body: JSON.stringify(data), pathParameters: JSON.stringify({id: 1})}, {}, function(err, response) {
                const body = JSON.parse(response.body);
                test.value(err).is(null);
                test.value(response.headers).is({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                });
                test.value(body.statusCode).is(200);
                done();
            });
        });

        it('addSensorData() - catches bad parameters', function(done) {
            const data = {
                properties: {
                    METAR: `CYYQ 182200Z 07002KT 15SM OVC017 06/03 A2966 RMK SC10 3 POLAR BEARS ALNG RNWY== `,
                },
            };
            addSensorData({body: JSON.stringify(data), pathParameters: JSON.stringify({id: -1})}, {}, function(err, response) {
                const body = JSON.parse(response.body);
                test.value(err).is(null);
                test.value(response.headers).is({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                });
                test.value(body.statusCode).is(400);
                done();
            });
        });


        it('getSensorData() - can get sensor data', function(done) {
            getSensorData({pathParameters: JSON.stringify({id: 1})}, {}, function(err, response) {
                const body = JSON.parse(response.body);
                test.value(err).is(null);
                test.value(response.headers).is({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                });
                test.value(body.statusCode).is(200);
                test.value(body.result[0].sensorId).is('1');
                DATAID = body.result[0].dataId;
                done();
            });
        });
        it('getSensorData() - catches bad path parameter', function(done) {
            getSensorData({pathParameters: JSON.stringify({id: 'spam'})}, {}, function(err, response) {
                const body = JSON.parse(response.body);
                test.value(err).is(null);
                test.value(response.headers).is({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                });
                test.value(body.statusCode).is(400);
                test.value(body.result).is('"id" must be a number');
                done();
            });
        });

        it('getSensors() - can get sensors with default params', function(done) {
            getSensors({}, {}, function(err, response) {
                const body = JSON.parse(response.body);
                test.value(err).is(null);
                test.value(response.headers).is({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                });
                test.value(body.statusCode).is(200);
                done();
            });
        });
        it('getSensors() - catches bad query parameters', function(done) {
            getSensors({queryStringParameters: {bbox: '0,0,0'}}, {}, function(err, response) {
                const body = JSON.parse(response.body);
                test.value(err).is(null);
                test.value(response.headers).is({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                });
                test.value(body.statusCode).is(400);
                test.value(body.result.message).is('"bbox" must contain 4 items');
                done();
            });
        });
        it('deleteSensorData() - can delete sensor data', function(done) {
            deleteSensorData({pathParameters: {id: 1, dataId: DATAID}}, {}, function(err, response) {
                const body = JSON.parse(response.body);
                test.value(err).is(null);
                test.value(response.headers).is({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                });
                test.value(body.statusCode).is(200);
                test.value(body.result).is({});
                done();
            });
        });
        it('deleteSensorData() - catches bad parameters', function(done) {
            deleteSensorData({pathParameters: {id: -1, dataId: DATAID}}, {}, function(err, response) {
                const body = JSON.parse(response.body);
                test.value(err).is(null);
                test.value(response.headers).is({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                });
                test.value(body.statusCode).is(400);
                test.value(body.result).is({message: '"id" must be larger than or equal to 1'});
                done();
            });
        });
        it('deleteSensorData() - throws error for invalid sensor id', function(done) {
            deleteSensorData({pathParameters: {id: 1, dataId: 9223372036854776}}, {}, function(err, response) {
                const body = JSON.parse(response.body);
                test.value(err).is(null);
                test.value(response.headers).is({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                });
                test.value(body.statusCode).is(400);
                test.value(body.result).is({message: 'Delete failed.'});
                done();
            });
        });

        it('getSensorData() - throws 404 for bad id value error', function(done) {
            getSensorData({pathParameters: JSON.stringify({id: 9223372036854776})}, {}, function(err, response) {
                const body = JSON.parse(response.body);
                test.value(err).is(null);
                test.value(response.headers).is({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                });
                test.value(body.statusCode).is(404);
                done();
            });
        });
    });
}

