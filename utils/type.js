// type.js
// getType(something): type: String
const getType = value => Object.prototype.toString.call(value).slice(8, -1);

const isNonEmptyArray = value => (
	Array.isArray(value) &&
	value.length > 0
);

const isNonEmptyString = value => (
	getType(value) === "String" &&
	value !== ""
);

const isNonBlankString = value => (
	getType(value) === "String" &&
	String.prototype.trim.call(value) !== ""
);

const check = (
  value, type, opt // has, length, startsWith, endsWith, contains
) => {
  if (getType(value) !== type) {
    return false;
  } else switch (type) {
    case "Object": {
      const hasOwn = prop => Object.prototype.hasOwnProperty.call(value, prop);
      switch (getType(opt.has)) {
        case "String": return hasOwn(opt.has);
        case "Array": return opt.has.every(hasOwn);
        default: return true;
      }
    }
    default: return true;
  }
};

export {
	getType,
	isNonEmptyArray,
	isNonEmptyString,
  isNonBlankString,
  check
};
