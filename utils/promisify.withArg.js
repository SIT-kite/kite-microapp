// promisify.withArg.js

// promisify(func): func(option, ...arg): Promise
export default func => (option, ...arg) => new Promise(
	(success, fail) => func(
		Object.assign( {}, option, { success, fail } ), ...arg
	)
);
