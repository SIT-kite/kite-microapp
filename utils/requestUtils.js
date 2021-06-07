/**
 * Promise化微信官方 wx-request 系列请求
 * FileName: requestUtils.js
 * Author: peanut996
 * CreateTime: 2020/9/14 15:24:45
 * Copyright (c) 2020 By peanut996 All rights reserved.
 * License: GPL v3
 */

const    GET = "GET";
const   POST = "POST";
const    PUT = "PUT";
const   HEAD = "HEAD";
const  PATCH = "PATCH";
const DELETE = "DELETE";

const    NETWORK_ERROR = "网络请求错误";
const    REQUEST_ERROR = "业务逻辑错误";
const NO_ACCOUNT_ERROR = "账号信息不存在错误";

const    SUCCESS_STAT_CODE = 0;
const NO_ACCOUNT_STAT_CODE = 120;

/**
 * 请求Promise化
 * @param {String} url
 * @param {Object} data
 * @param {Object} header
 * @return {Promise}
 */

const doGET    = (url, data, header) => request(url, data, header, GET);
const doPOST   = (url, data, header) => request(url, data, header, POST);
const doPUT    = (url, data, header) => request(url, data, header, PUT);
const doHEAD   = (url, data, header) => request(url, data, header, HEAD);
const doPATCH  = (url, data, header) => request(url, data, header, PATCH);
const doDELETE = (url, data, header) => request(url, data, header, DELETE);

const request = (url, data, header, method) => new Promise(
  (resolve, reject) => wx.request({
    url, data, header, method,
    success: res => {
      if (res.data.code == SUCCESS_STAT_CODE) {
        resolve(res);
      } else {
        if (res.data.code == NO_ACCOUNT_STAT_CODE) {
          res.error = NO_ACCOUNT_ERROR;
        } else {
          res.error = REQUEST_ERROR;
        }
        reject(res);
      }
    },
    fail: res => {
      res.error = NETWORK_ERROR;
      reject(res);
    }
  })
);

/**
 * wx-Login请求Promise化
 */
var wxLogin = () => new Promise(
  (resolve, reject) => wx.login({
    success: res => resolve(res),
    fail: res => reject(res)
  })
);

module.exports = {
  request: request,
  doGET: doGET,
  doPOST: doPOST,
  doPUT: doPUT,
  doHEAD: doHEAD,
  doPATCH: doPATCH,
  doDELETE: doDELETE,
  wxLogin: wxLogin,
  NETWORK_ERROR: NETWORK_ERROR,
  REQUEST_ERROR: REQUEST_ERROR,
  NO_ACCOUNT_ERROR: NO_ACCOUNT_ERROR
};
