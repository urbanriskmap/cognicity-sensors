process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Axios AWS cert issue
import axios from 'axios';

// Local objects
import config from '../../config';

/**
 * Endpoint for montoring sensor lambda
 * @function monitoring
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Object} callback - Callback (HTTP response)
 */
export default (event, context, callback) => {
    const p1 = axios.get(config.ENDPOINT, {
    params: {
        bbox: '-81,27,-79,25',
        geoformat: 'geojson',
        },
    });

    Promise.all([p1]).then((values) => {
        const response = values[0];
        if (response.data.statusCode === 200) {
            console.log('Recieve 200 response from ' + config.ENDPOINT);
            callback(null, JSON.stringify(
                'Received 200 response from ' + config.ENDPOINT));
        } else {
            console.log('Received non 200 response from ' + config.ENDPOINT);
            callback(new Error(
                'Received non 200 response from ' + config.ENDPOINT));
        }
    }).catch((err) => {
        console.log(
            'Error requesting ' + config.ENDPOINT + ' - ' + err.message);
        callback(new Error(
            'Error requesting ' + config.ENDPOINT + ' - ' + err.message));
    });
};
