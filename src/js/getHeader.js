// HTTP Header

const isString = _ => Object.prototype.toString.call(_) === "[object String]";

const contentTypeMap = new Map([
	["urlencoded", "application/x-www-form-urlencoded"],
	["json", "application/json"]
]);

// getHeader(headerType: ["urlencoded", "json"], token?: String): header: Object
export default (headerType = "urlencoded", token) => {

	if (!isString(headerType)) {
		throw "headerType is not a String";
	}

	const contentType = contentTypeMap.get(headerType);

	if (contentType === undefined) {
		throw "headerType not found in contentTypeMap";
	}

	const header = { "Content-Type": contentType };

	if (token !== undefined) {
		if (isString(token)) {
			header["Authorization"] = `Bearer ${token}`;
		} else {
			throw "token is not a String";
		}
	}

	return header;

};
