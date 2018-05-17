process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Axios AWS cert issue
import axios from 'axios';
/**
 * Monitoring class for sensor endpoints
 * @class
 * @param {Object} config - default parameters for sensors framework
 * @return {Object} Function methods
 **/
export default class Monitoring {
    /**
     * constructor for class SensorData
     * @param {Object} config - Lambda configuration object
     */
    constructor(config) {
        this.axios = axios;
        this.config = config;
    }

    /**
     * Verify get sensors endpoint working
     * @function getSensors
     * @return {Promise} - Result of request and validation
     */
    getSensors() {
        const endpoint = this.config.ENDPOINT;
        return new Promise((resolve, reject) => {
            this.axios.get(endpoint, {
                params: {
                    bbox: '-81,27,-79,25',
                    geoformat: 'geojson',
                },
            }).then((response) => {
                if (response.data.statusCode === 200) {
                    console.log('Received 200 response from ' +
                        endpoint);
                    resolve('Received 200 response from ' +
                        endpoint);
                } else {
                    console.log('Received non 200 response from ' +
                        endpoint);
                    reject(new Error(
                        'Received non 200 response from ' + endpoint +
                        '. Error was: ' + response.errorMessage));
                }
            }).catch((err) => reject(err));
        });
    }

    /**
     * Verify get sensor data endpoint working
     * @function getSensorData
     * @return {Promise} - Result of request and validation
     */
    getSensorData() {
        const endpoint = this.config.ENDPOINT + '1';
        return new Promise((resolve, reject) => {
            this.axios.get(endpoint, {
            }).then((response) => {
                if (response.data.statusCode === 200) {
                    console.log('Received 200 response from ' +
                        endpoint);
                    resolve('Received 200 response from ' +
                        endpoint);
                } else {
                    console.log('Received incorrect response from ' +
                        endpoint);
                    reject(new Error(
                        'Received incorrect response from ' + endpoint +
                        '. Error was: ' + response.errorMessage));
                }
            }).catch((err) => {
                // Happy with a 404 if sensor not in database
                if (err.response.data.statusCode === 404) {
                    console.log('Received correct 404 response from ' +
                    endpoint);
                resolve('Received correct 404 response from ' +
                    endpoint);
                } else {
                    console.log('Received incorrect response from ' +
                        endpoint);
                    reject(new Error(
                        'Received incorrect response from ' + endpoint +
                        '. Error was: ' + err));
                }
            });
        });
    }

    /**
     * Verify get sensors endpoint working
     * @function addSensor
     * @return {Promise} - Result of request and validation
     */
    addSensor() {
        const endpoint = this.config.ENDPOINT;
        return new Promise((resolve, reject) => {
            this.axios.post(endpoint,
                {
                    properties: {
                        name: 'test sensor',
                    },
                },
                {
                    headers: {
                        'x-api-key': this.config.API_KEY,
                },
            }).then((response) => {
                // Received 200 response, but should have raised a 400 error
                reject(new Error('Expecting 400 response, received 200 from ' +
                    endpoint));
            }).catch((err) => {
                // Happy with a 400 for missing location param
                console.log(err.response.data.statusCode);

                if (err.response.data.statusCode === 400) {
                    console.log('Received correct 400 response from ' +
                        endpoint);
                    resolve('Received correct 400 response from ' +
                        endpoint);
                } else {
                    console.log('Received incorrect response from ' +
                        endpoint);
                    reject(new Error(
                        'Received incorrect response from ' + endpoint +
                        '. Error was: ' + err));
                }
                reject(err);
            });
        });
    }
  }
