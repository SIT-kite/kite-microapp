// promisify.js

// promisify(func): func(option): Promise
export default func => option => new Promise(
	(success, fail) => func(
		Object.assign( {}, option, { success, fail } )
	)
);
