// request.js

import { isNonBlankString } from "./type";

// request(obj): Promise
// import promisify from "./promisify";
// const requestRaw = promisify(wx.request);

const symbols = {
	codeNotZero: Symbol("codeNotZero"),
	codeError:   Symbol("codeError"),
	dataError:   Symbol("dataError"),
	statusError: Symbol("statusError"),
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
	statusError: {
		msg: "res.statusCode is not 200",
		symbol: symbols.statusError
	},
	resError: {
		msg: "res is not an Object",
		symbol: symbols.resError
	}
}

// addErrorInfo(res, errorType, option): Object.assign(res, { option, msg, symbol })
const addErrorInfo = (res, errorType, option) => Object.assign(
	res, { option }, (() => {

		switch (errorType) {

			case "code":
				return !("code" in res.data)
					? errors.codeMissing
					: typeof res.data.code !== "number"
						? errors.codeNotNumber
						: errors.codeNotZero;

			case "data": return errors.dataError;
			case "status": return errors.statusError;
			case "res": return errors.resError;
			default: throw "errorType is not code, data, status or res!";

		}

	})()
);

// request(option): Promise
const request = option => new Promise((resolve, reject) => {

	// success(res)
	const success = res => {

		const rejectFor = (errorType) => reject(
			addErrorInfo(res, errorType, option)
		);

		// check res
		typeof res !== "object" ? rejectFor("res")
			// check res.statusCode
			: res.statusCode !== 200 ? rejectFor("status")
				// check res.data (Object or ArrayBuffer)
				: typeof res.data !== "object"
					// check res.data (String)
					? typeof res.data !== "string" ? rejectFor("data") : resolve(res)
					// check res.data.code
					: res.data.code !== 0 ? rejectFor("code") : resolve(res);

	};

	wx.request(
		Object.assign({}, option, { success, fail: reject })
	);

});

// getMsg(res): msg: String
const getMsg = res => (
	res?.symbol === symbols.codeNotZero &&
	isNonBlankString(res?.data?.msg)
		? res.data.msg
		: res.msg
);

// checkCode(res, code): Boolean
const checkCode = (res, code) => (
	res?.symbol === symbols.codeNotZero &&
	res?.data?.code === code
);

// request(obj): Promise
export default Object.assign(
	request, { symbols, getMsg, checkCode }
);

// https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
/* wx.request({
  url: String,
  data: String | Object | ArrayBuffer,
  dataType: "json" | "其他",
  enableCache: true,
  enableHttp2: true,
  enableQuic:  true,
  header: header,
  method: "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "OPTIONS" | "TRACE" | "CONNECT",
  responseType: "text" | "arraybuffer",
  timeout: 0,
  success:  res => {},
  fail:     res => {},
  complete: res => {},
});

res = {
  statusCode: Number,
  header: {},
  data: {},
  cookies: [],
  profile: {}
}; */
