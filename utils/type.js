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
  value, type, opt = {} // has, length, startsWith, endsWith, contains
) => {
  if (getType(value) !== type) {
    return false;
  } else switch (type) {
    case "Object": {
      if ("has" in opt) {
        const hasOwn = prop => Object.prototype.hasOwnProperty.call(value, prop);
        switch (getType(opt.has)) {
          case "String": return hasOwn(opt.has);
          case "Array": return opt.has.every(hasOwn);
          default: return true;
        }
      }
      if ("is" in opt) {

      }
    }
    default: return true;
  }
};

const checkObject = (obj, opt) => {

  if (getType(obj) !== "Object") {
    return false;
  } else {
    if ("has" in opt) {
      const notOwn = prop => !Object.prototype.hasOwnProperty.call(obj, prop);
      switch (getType(opt.has)) {
        case "String": if ( notOwn(opt.has)      ) { return false; } break;
        case "Array":  if ( opt.has.some(notOwn) ) { return false; } break;
        default: throw "obj.has is not a String or Array";
      }
    }
    if ("is" in opt) {
      if (getType(obj) !== "Object") {
        throw "obj.is is not an Object";
      } else {
        for (const key in obj.is) {
          if (
            Object.hasOwnProperty.call(obj.is, key) &&
            getType(obj[key]) !== obj.is[key]
          ) { return false; }
        }
        return true;
      }
    }
  }
}

export {
	getType,
	isNonEmptyArray,
	isNonEmptyString,
  isNonBlankString,
  check,
  checkObject
};
