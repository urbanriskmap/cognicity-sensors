// Local objects
import config from '../../config';
import Monitoring from '../../lib/Monitoring';

/**
 * Endpoint for montoring sensor lambda
 * @function monitoring
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Object} callback - Callback (HTTP response)
 */
export default (event, context, callback) => {
    // Monitoring instance
    const mtr = new Monitoring(config);

    // Make requests
    Promise.all(mtr.getSensors(), mtr.getSensorData(), mtr.addSensor())
        .then((res) => callback(null, res))
        .catch((err) => callback(err));
};
