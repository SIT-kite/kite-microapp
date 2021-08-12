// 实名认证
// pages/verify/verify.js

import getHeader from "../../utils/getHeader";
import { handlerGohomeClick, handlerGobackClick } from "../../utils/navBarUtils";
import onShareAppMessage from "../../utils/onShareAppMessage";
import request from "../../utils/request";

const app = getApp();
const gData = app.globalData;

const getCanUpload = uploadInfo => Boolean(
  uploadInfo.studentId && uploadInfo.oaSecret
);

Page({

  data: {
    canUpload: false,
    uploadInfo: {
      studentId: null,
      oaSecret: null,
    }
  },

  handlerGohomeClick,
  handlerGobackClick,
  onShareAppMessage,

  bindId(e) {
    this.setData({
      canUpload: getCanUpload(this.data.uploadInfo),
      "uploadInfo.studentId": e.detail.value
    })
  },

  bindSecret(e) {
    this.setData({
      canUpload: getCanUpload(this.data.uploadInfo),
      "uploadInfo.oaSecret": e.detail.value
    })
  },

  verify() {

    const uploadInfo = this.data.uploadInfo;

    // 删除 uploadInfo 中值为空字符串的属性
    for (let i in uploadInfo) {
      if (uploadInfo[i] === "") {
        delete uploadInfo[i];
      }
    }

    this.setData({ uploadInfo });
    wx.wx.setStorageSync("uploadInfo", uploadInfo);

    // 认证
    request({
      method: "POST",
      url: `${gData.apiUrl}/user/${gData.uid}/identity`,
      header: getHeader("urlencoded", gData.token),
      data: uploadInfo,
    }).then(() => {

      gData.isStudent = true;
      wx.setStorageSync("isStudent", true);

      wx.showModal({
        title: "认证成功",
        content: "认证成功！",
        confirmText: "回到主页",
        success: () => wx.navigateBack({delta: 1})
      });

    }).catch(
      err => wx.showModal({
        title: "哎呀，出错误了 >.<",
        content:
          err.symbol === request.symbols.codeNotZero &&
          typeof err.res.data.msg === "string"
          ? err.res.data.msg
          : "业务逻辑出错",
        showCancel: false
      })
    );


  },

  // onLoad() {},

  onReady() {

    if (!gData.signPrivacyConfirm) {
      wx.showModal({
        title: "隐私信息提示",
        content:
          "小程序部分功能（如闲置交易、课程表）需要验证并" +
          "使用您的身份信息，以提供功能或保证交易安全。",
        showCancel: true,
        cancelText: "我拒绝",
        confirmText: "我已知晓",
        confirmColor: "#4B6DE9",
        success: result => {
          if (!result.confirm) {
            this.handlerGobackClick();
          } else {
            gData.signPrivacyConfirm = true;
            wx.setStorageSync("signPrivacyConfirm", true);
          }
        }
      });
    }

  },

  onShow() {
    const uploadInfo = wx.getStorageSync("uploadInfo");
    this.setData({
      uploadInfo,
      canUpload: getCanUpload(uploadInfo)
    });
  }

})
