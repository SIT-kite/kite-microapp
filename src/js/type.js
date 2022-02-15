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

const check = (value, type) => getType(value) === type;

// checkObject(obj, ref: Object): Boolean
const checkObject = (obj, ref) => {

	if (getType(obj) !== "Object") {
		return false;
	} else if (getType(ref) !== "Object") {
		throw "ref is not an Object";
	} else {
		const hasOwn = (instance, key) => Object.hasOwnProperty.call(instance, key);
		const ok = key =>
			(ref[key] === "*" && hasOwn(obj, key)) ||
			getType(obj[key]) === ref[key];
		for (const key in ref) {
			if (hasOwn(ref, key) && !ok(key)) { return false; }
		}
		return true;
	}

};

// checkObjectHas(obj, has: String | Array): Boolean
const checkObjectHas = (obj, has) => {

	if (getType(obj) !== "Object") {
		return false;
	} else {
		const hasOwn = prop => Object.hasOwnProperty.call(obj, prop);
		switch (getType(has)) {
			case "String": return hasOwn(has);
			case "Array": return has.every(hasOwn);
			default: throw "has is not a String or Array";
		}
	}

};

// check(a, "Object")
// checkObject(a, { b: "String", c: "*" })
// checkObjectHas(a, ["b", "c"])

// checkStringLength(), checkArrayLength(), startsWith(), endsWith(), contains()...

export {
	getType,
	isNonEmptyArray,
	isNonEmptyString,
	isNonBlankString,
	check,
	checkObject,
	checkObjectHas
};
