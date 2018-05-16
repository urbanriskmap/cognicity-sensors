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
    return new Promise((resolve, reject) => {
        axios.get(config.ENDPOINT, {
            params: {
                bbox: '-81,27,-79,25',
                geoformat: 'geojson',
            },
        }).then((response) => {
            console.log(response);
            if (response.data.statusCode === 200) {
                console.log('Recieve 200 response from ' +
                    config.ENDPOINT);
                resolve('Received 200 response from ' +
                    config.ENDPOINT);
            } else {
                console.log('Received non 200 response from ' +
                    config.ENDPOINT);
                reject(new Error(
                    'Received non 200 response from ' + config.ENDPOINT));
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
    getSensors()
        .then((res) => callback(null, res))
        .catch((err) => callback(err));
};
