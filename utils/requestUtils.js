/**
 * Promise化微信官方 wx-request系列请求
 * FileName: requestUtils.js
 * Author: peanut996
 * CreateTime: 2020//9/14 15:24:45
 * Copyright (c) 2020 By peanut996 All rights reserved.
 * License: GPL v3
 */
const GET = "GET";
const POST = "POST";
const PUT = "PUT";

var get = (url, data, header) => {
  return request(url, data, header,GET);
}

var post = (url, data, header) => {
  return request(url, data, header,POST);
}

var put = (url, data, header) => {
  return request(url, data, header,PUT);
}

var request = (url, data, header, method) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      header: header,
      method: method,
      success: (result) => {
        if (result.data.code == 0) {
          resolve(result);
        } else {
          reject(result);
        }
      },
      fail: (result) => {
        reject(result);
      },
      complete: () => { }
    });
  });
}

module.exports = {
  request: request,
  get: get,
  post: post,
  put: put
}