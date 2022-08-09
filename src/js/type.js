// type.js
// 类型相关辅助函数
// Type related helper functions

// getType(value): type: String
const getType = value => Object.prototype.toString.call(value).slice(8, -1);

// hasOwn(obj, prop): Boolean
const hasOwn = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

// isNonEmptyArray(value): Boolean
const isNonEmptyArray = value => (
	Array.isArray(value) &&
	value.length > 0
);

// isNonEmptyString(value): Boolean
const isNonEmptyString = value => (
	getType(value) === "String" &&
	value !== ""
);

// isNonBlankString(value): Boolean
const isNonBlankString = value => (
	getType(value) === "String" &&
	String.prototype.trim.call(value) !== ""
);

// check(value, type): Boolean
const check = (value, type) => getType(value) === type;

// checkObject(obj, ref: Object): Boolean
// checkObject({ a: 1 }, { a: Number }) === true
const checkObject = (obj, ref) => {

	if (getType(obj) !== "Object") {
		return false;
	} else if (getType(ref) !== "Object") {
		throw "ref is not an Object";
	} else {
		const ok = key => (
			(ref[key] === "*" && hasOwn(obj, key)) ||
			getType(obj[key]) === ref[key]
		);
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
	hasOwn,
	isNonEmptyArray,
	isNonEmptyString,
	isNonBlankString,
	check,
	checkObject,
	checkObjectHas
};
