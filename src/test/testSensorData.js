import * as test from 'unit.js';

// Locals
import SensorData from '../lib/SensorData';
import config from '../config';

/**
 * SensorData class testing
 */
export default function() {
    describe('Sensor class testing', function() {
        // globals
        const sensorData = new SensorData(config, {});

        // set error toggles
        let queryError = false;

        before(function() {
            const mockQuery = function(query, params) {
                return new Promise((resolve, reject) => {
                    if (queryError === false) {
                        resolve({rows: ['success']});
                    } else {
                        reject(new Error('query error'));
                    }
                });
            };
            sensorData.pool.query = mockQuery;
        });

        it('Can create a class instance', function() {
            test.value(sensorData instanceof SensorData).is(true);
        });

        it('Can handle query errors in get()', function(done) {
            queryError = true;
            sensorData.get({})
                .catch((err) => {
                    test.value(err.message).is('query error');
                    done();
                });
        });

        it('Can handle query errors in insert()', function(done) {
            queryError = true;
            sensorData.insert({}, {})
                .catch((err) => {
                    test.value(err.message).is('query error');
                    done();
                });
        });

        it('Can handle query errors in delete()', function(done) {
            queryError = true;
            sensorData.delete({}, {})
                .catch((err) => {
                    test.value(err.message).is('query error');
                    done();
                });
        });


        it('Can resolve request to get()', function(done) {
            queryError = false;
            sensorData.get({})
                .then((res) => {
                    test.value(res.rows[0]).is('success');
                    done();
                });
        });


        it('Can resolve request to insert()', function(done) {
            queryError = false;
            sensorData.insert({})
                .then((res) => {
                    test.value(res.rows[0]).is('success');
                    done();
                });
        });


        it('Can resolve request to delete()', function(done) {
            queryError = false;
            sensorData.delete({})
                .then((res) => {
                    test.value(res.rows[0]).is('success');
                    done();
                });
        });
    });
}

