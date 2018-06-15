import * as test from 'unit.js';

// Locals
import Sensors from '../lib/Sensors';
import config from '../config';

/**
 * Sensor class testing
 */
export default function() {
    describe('Sensor class testing', function() {
        // globals
        const sensor = new Sensors(config, {});

        // overload dbgeo library
        sensor.dbgeo = {};

        // set error toggles
        let queryError = false;
        let parseError = false;

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
            sensor.pool.query = mockQuery;

            const mockParse = function(data, params, callback) {
                if (parseError === false) {
                    callback(null, 'parse succesful');
                } else {
                    callback(new Error('parse error'), {});
                }
            };
            sensor.dbgeo.parse = mockParse;
        });

        it('Can create a class instance', function() {
            test.value(sensor instanceof Sensors).is(true);
        });

        it('Can handle query errors in all()', function(done) {
            queryError = true;
            parseError = false;
            sensor.all({bbox: [], geoformat: '', agency: ''})
                .catch((err) => {
                    test.value(err.message).is('query error');
                    done();
                });
        });

        it('Can handle dbgeo errors in all()', function(done) {
            queryError = false;
            parseError = true;
            sensor.all({bbox: [], geoformat: '', agency: ''})
                .catch((err) => {
                    test.value(err.message).is('parse error');
                    done();
                });
        });

        it('Can handle dbgeo errors in insert()', function(done) {
            queryError = false;
            parseError = true;
            sensor.insert({}, {})
                .catch((err) => {
                    test.value(err.message).is('parse error');
                    done();
                });
        });

        it('Can handle query errors in insert()', function(done) {
            queryError = true;
            parseError = false;
            sensor.insert({}, {})
                .catch((err) => {
                    test.value(err.message).is('query error');
                    done();
                });
        });

        it('Cab handle query errors delete()', function(done) {
            queryError = true;
            parseError = false;
            sensor.delete({}, {})
                .catch((err) => {
                    test.value(err.message).is('query error');
                    done();
                });
        });

        it('Sucesfully resolves insert()', function(done) {
            queryError = false;
            parseError = false;
            sensor.insert({}, {})
                .then((res) => {
                    test.value(res).is('parse succesful');
                    done();
                });
        });

        it('Sucesfully resolves delete()', function(done) {
            queryError = false;
            parseError = false;
            sensor.delete({}, {})
                .then((res) => {
                    test.value(res.rows[0]).is('success');
                    done();
                });
        });
    });
}

