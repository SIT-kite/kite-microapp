// HTTP Header

const isString = _ => Object.prototype.toString.call(_) === "[object String]";

const contentTypeMap = new Map([
  [ "urlencoded" , "application/x-www-form-urlencoded" ],
  [ "json"       , "application/json" ]
]);

// getHeader(type: ["urlencoded", "json"], token: String): header: Object
export default (type, token) => {

  if ( !isString(type) ) {
    throw "type is not a String";
  }

  const contentType = contentTypeMap.get(type);

  if ( contentType === undefined ) {
    throw "type not found in contentTypeMap";
  }

  const header = { "Content-Type": contentType };

  if ( isString(token) ) {
    header["Authorization"] = `Bearer ${token}`;
  }

  return header;

};
