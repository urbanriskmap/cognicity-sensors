process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Axios AWS cert issue
import axios from 'axios';

// Local objects
import config from '../../config';

/**
 * Verify get sensors endpoint working
 * @function getSensors
 * @return {Promise} - Result of request and validation
 */
function getSensors() {
    const endpoint = config.ENDPOINT;
    return new Promise((resolve, reject) => {
        axios.get(endpoint, {
            params: {
                bbox: '-81,27,-79,25',
                geoformat: 'geojson',
            },
        }).then((response) => {
            if (response.data.statusCode === 200) {
                console.log('Recieve 200 response from ' +
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
 * Verify get sensors endpoint working
 * @function getSensors
 * @return {Promise} - Result of request and validation
 */
function getSensorData() {
    const endpoint = config.ENDPOINT + '1';
    return new Promise((resolve, reject) => {
        axios.get(endpoint, {
        }).then((response) => {
            // Happy with a 404 if sensor not in database
            if (response.data.statusCode === 200 ||
                response.data.statusCode === 404) {
                console.log('Recieve 200 or 404 response from ' +
                    endpoint);
                resolve('Received 200 or 404 response from ' +
                    endpoint);
            } else {
                console.log('Received non 200 or 404 response from ' +
                    endpoint);
                reject(new Error(
                    'Received non 200 or 404 response from ' + endpoint +
                    '. Error was: ' + response.errorMessage));
            }
        }).catch((err) => reject(err));
    });
}

/**
 * Endpoint for montoring sensor lambda
 * @function monitoring
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Object} callback - Callback (HTTP response)
 */
export default (event, context, callback) => {
    // Make requests
    Promise.all(getSensors(), getSensorData())
        .then((res) => callback(null, res))
        .catch((err) => callback(err));
};
