/**
 * 通用Promise化微信官方请求
 * FileName: promisifyUtils.js
 * Author: peanut996
 * CreateTime: 2020//9/15 18:24:45
 * Copyright (c) 2020 By peanut996 All rights reserved.
 * License: GPL v3
 */

/**
 * 使用样例
 * const promisify = require('./promisify');
 * const wx_login = promisify(wx.login);
 * wx_login().then((res) => {
 *   const { code } = res;
 * });
 *  
 */

module.exports = (api) => {
  return (option, ...params) => {
    return new Promise((resolve, reject) => {
      api(Object.assign({}, option, { success: resolve, fail: reject }), ...params);
    });
  }
};