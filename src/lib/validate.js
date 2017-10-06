
export default function(config){
  let methods = {};
  /**
    * Validates incoming bounding box parameters from request
    * @function _validateBBOX
    * @param {Object} bounds - bounds
    * @return {String} - Type of message
  **/
  methods.bounds = function(bbox) {
    if (bbox){
      let coords = bbox.split(',')
      if (coords.length != 4)
        return ('bbox value must be in format xmin,ymin,xmax,ymax')
      else if ((coords[0] < -180 || coords[0] > 180) && (coords[1] < -90 || coords[1] > 90 ) && (coords[2] < -180 || coords[2] > 180) && (coords[3] <-90 || coords[3] > 90 ))
        return ('bbox values out of range')
      else {
        return (null, bbox)
      }
    }
    else {
      return (null, [-180, -90, 180, 90])
    }
  };
  /**
    * Validates incoming bounding box parameters from request
    * @function _validateBBOX
    * @param {Object} bounds - bounds
    * @return {String} - Type of message
  **/
  methods.geoFormat = function(format) {
    if (format){
      if (config.GEO_FORMATS.includes(format)){
        return (null, format);
      }
      else {
        return ('geo format value must be one of ' + config.GEO_FORMATS);
      }
    }
    else {
      return (null, config.GEO_FORMAT_DEFAULT);
    }
  };
  return methods;
}
