// promisify.js

// promisify(func): func(option): Promise
export default func => option => new Promise(
	(success, fail) => func(
		Object.assign( {}, option, { success, fail } )
	)
);

// promisify.js with arguments:
// promisify(func): func(option, ...arg): Promise
/* export default func => (option, ...arg) => new Promise(
	(success, fail) => func(
		Object.assign( {}, option, { success, fail } ), ...arg
	)
); */
