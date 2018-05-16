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
export default async (event, context, callback) => {
  try {
    const response = await axios.get(config.ENDPOINT, {
    rejectUnauthorized: false,
    params: {
        bbox: '-81,27,-79,25',
        geoformat: 'geojson',
        },
    });
    if (response.data.statusCode === 200) {
        console.log('Recieve 200 response from ' + config.ENDPOINT);
        callback(null, JSON.stringify(
            'Received 200 response from ' + config.ENDPOINT));
    } else {
        console.log('Received non 200 response from ' + config.ENDPOINT);
        callback(new Error(
            'Received non 200 response from ' + config.ENDPOINT));
    }
  } catch (err) {
        console.log(
            'Error requesting ' + config.ENDPOINT + ' - ' + err.message);
        callback(new Error(
            'Error requesting ' + config.ENDPOINT + ' - ' + err.message));
  }
};
