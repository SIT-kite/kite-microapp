// type.js
// getType(something): type: String
const getType = _ => Object.prototype.toString.call(_).slice(8, -1);

const isNonEmptyArray = _ => (
	Array.isArray(_) &&
	_.length > 0
);

const isNonEmptyString = _ => (
	getType(_) === "String" &&
	_ !== ""
);

const isNonBlankString = _ => (
	getType(_) === "String" &&
	String.prototype.trim.call(_) !== ""
);

export {
	getType,
	isNonEmptyArray,
	isNonEmptyString,
	isNonBlankString
};
