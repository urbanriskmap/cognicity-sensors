/**
  * Validation methods
  * @function validate
  * @param {Object} config - Sensors configuration object
  * @return {Object} - Validation methods
**/
export default function(config) {
  let methods = {};
  /**
    * Validates incoming bounding box parameters from request
    * @function bounds
    * @param {Array} bbox - Bounds as [xmin, ymin, xmax, ymax]
    * @return {Object} - Bounds object
  **/
  methods.bounds = function(bbox) {
    if (bbox) {
      let coords = bbox.split(',').map(parseFloat);
      if (coords.length != 4) {
        return {err: 'bbox value must be in format xmin,ymin,xmax,ymax',
                value: null};
      } else if ((coords[0] < -180 || coords[0] > 180)
            || (coords[1] < -90 || coords[1] > 90 )
            || (coords[2] < -180 || coords[2] > 180)
            || (coords[3] < -90 || coords[3] > 90 )) {
              return {err: 'bbox values out of range', value: null};
            } else {
              return {err: null, value: coords};
            }
          } else {
            return {err: null, value: [-180, -90, 180, 90]};
          }
  };
  /**
    * Validates incoming bounding box parameters from request
    * @function geoFormat
    * @param {String} format - Requested format
    * @return {Object} - Geo format object
  **/
  methods.geoFormat = function(format) {
    if (format) {
      if (config.GEO_FORMATS.includes(format)) {
        return {err: null, value: format};
      } else {
        return {err: 'geo format value must be one of ' + config.GEO_FORMATS,
                value: null};
      }
    } else {
      return {err: null, value: config.GEO_FORMAT_DEFAULT};
    }
  };
  return methods;
}
