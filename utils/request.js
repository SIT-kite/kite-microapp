// request.js

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

// getError(errorType, res): Object.assign(res, { option, msg, symbol })
const addErrorInfo = (errorType, res, option) => Object.assign(
  res, { option }, (() => {

    switch (errorType) {

      case "code":
        return !("code" in res.data)
          ? errors.codeMissing
          : typeof res.data.code !== "number"
            ? errors.codeNotNumber
            : errors.codeNotZero;

      case   "data": return errors.dataError;
      case "status": return errors.statusError;
      case    "res": return errors.resError;
      default: throw "errorType is not code, data, status or res!";

    }

  })()
);

const request = option => new Promise(
  (resolve, reject) => {
    wx.request(
      Object.assign(
        {}, option, {

          success: res => {

            const rejectFor = errorType => reject(
              addErrorInfo(errorType, res, option)
            );

            typeof res !== "object"
            ? rejectFor("res")

            : res.statusCode !== 200
            ? rejectFor("status")

              : typeof res.data !== "object"

                ? typeof res.data !== "string"
                  ? rejectFor("data")
                  : resolve(res)

                : res.data.code !== 0
                  ? rejectFor("code")
                  : resolve(res);

          },

          fail: reject

        }
      )
    )
  }
);

// request(obj): Promise
export default Object.assign(
  request, { symbols }
);

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
  success: res => {},
  fail: res => {},
  complete: res => {},
});

res = {
  statusCode: Number,
  header: {},
  data: {},
  cookies: []
}; */
