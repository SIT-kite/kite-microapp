// 实名认证
// pages/verification/verification.js
import { handlerGohomeClick, handlerGobackClick } from "../../utils/navBarUtils";
const requestUtils = require("../../utils/requestUtils");

const app = getApp();

const getCanUpload = uploadInfo => Boolean(
  uploadInfo.studentId && uploadInfo.oaSecret
);

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canUpload: false,
    uploadInfo: {
      studentId: null,
      oaSecret: null,
    }
  },

  handlerGohomeClick,
  handlerGobackClick,

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

    // 删除 uploadInfo 中值为空字符串的属性
    for (let i in this.data.uploadInfo) {
      if (this.data.uploadInfo[i] === "") {
        delete this.data.uploadInfo[i];
      }
    }

    const that = this;

    that.setData({
      uploadInfo: that.data.uploadInfo
    });

    wx.setStorage({
      data: this.data.uploadInfo,
      key: 'uploadInfo'
    });

    // 认证
    const url = `${app.globalData.commonUrl}/user/${app.globalData.uid}/identity`;
    const data = that.data.uploadInfo;
    const header =  {
      "content-type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${app.globalData.token}`
    };
    requestUtils.doPOST(url, data, header).then(() => {

      app.globalData.isStudent = true;
      wx.setStorageSync("isStudent", true);

      wx.showModal({
        title: "认证成功",
        content: "认证成功！",
        confirmText: "回到主页",
        success: () => wx.navigateBack({delta: 1})
      });

    }).catch(res => {
      if (res.error === requestUtils.NETWORK_ERROR) {
        wx.showModal({
          title: "哎呀，出错误了>.<",
          content: "网络不在状态",
          showCancel: false,
        });
      } else if (res.error === requestUtils.REQUEST_ERROR) {
        wx.showModal({
          title: "哎呀，出错误了>.<",
          content: res.data.msg || "业务逻辑出错",
          showCancel: false
        });
      }
    });

  },

  // onLoad() {},

  onReady() {
    const handlerGobackClick = this.handlerGobackClick;
    if (!app.globalData.signPrivacyConfirm) {
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
            handlerGobackClick();
          } else {
            app.globalData.signPrivacyConfirm = true;
            wx.setStorageSync("signPrivacyConfirm", true);
          }
        }
      });
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const that = this;
    wx.getStorage({
      key: "uploadInfo",
      success(res) {
        that.setData({
          uploadInfo: res.data,
          canUpload: getCanUpload(that.data.uploadInfo)
        })
      }
    })
  },

})
