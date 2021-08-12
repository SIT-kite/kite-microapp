// request.js
// https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
/* wx.request({
	url: String,
	data: String | Object | ArrayBuffer,
	dataType: "json" | "其他",
	enableCache: true,
	enableHttp2: true,
	enableQuic: true,
	header: header,
	method: method,
	responseType: responseType,
	timeout: 0,
	success: (res) => {},
	fail: (res) => {},
	complete: (res) => {},
}) */

const symbols = {
	codeNotZero: Symbol("codeNotZero"),
	codeError:   Symbol("codeError"),
	dataError:   Symbol("dataError"),
	resError:    Symbol("resError")
};

const errors = {
	codeNotZero: {
		msg: "res.data.code is not 0",
		symbol: symbols.codeNotZero
	},
	codeNotNumber: {
		msg: "res.data.code is not a Number",
		symbol: symbols.codeError
	},
	codeMissing: {
		msg: "res.data.code missing",
		symbol: symbols.codeError
	},
	dataError: {
		msg: "res.data is not an Object or a String",
		symbol: symbols.dataError
	},
	resError: {
		msg: "res is not an Object",
		symbol: symbols.resError
	}
}

// getError(errorType, res): { res, msg: String, symbol: Symbol }
const getError = (errorType, res) => Object.assign(
	{ res }, (() => {

		switch (errorType) {

			case "code":
				return !("code" in res.data)
					? errors.codeMissing
					: typeof res.data.code !== "number"
						? errors.codeNotNumber
						: errors.codeNotZero;

			case "data": return errors.dataError;
			case "res": return errors.resError;
			default: throw "errorType is not one of code, data or res!";

		}

	})()
);

// request(obj): Promise
export default Object.assign(
	option => new Promise(
		(resolve, reject) => wx.request(
			Object.assign(
				{}, option, {

					success: res =>

						typeof res === "object"

							? typeof res.data === "object"
								? res.data.code === 0
									? resolve(res)
									: reject(getError("code", res))

							: typeof res.data === "string"
								? resolve(res)
								: reject(getError("data", res))

							: reject(getError("res", res)),

					fail: reject

				}
			)
		)
	), { symbols }
);
