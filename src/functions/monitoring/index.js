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
    params: {
        bbox: '-81,27,-79,25',
        geoformat: 'geojson',
        },
    });
    console.log('Succesfully recieve response from ' + config.ENDPOINT);
    console.log(JSON.stringify(response.statusCode));
  } catch (err) {
        console.log('Error with ' + config.ENDPOINT + ' - ' + err.message);
  }
};
