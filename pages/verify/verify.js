// 实名认证
// pages/verify/verify.js

import getHeader from "../../utils/getHeader";
import { handlerGohomeClick, handlerGobackClick } from "../../utils/navBarUtils";
import onShareAppMessage from "../../utils/onShareAppMessage";
import request from "../../utils/request";

const app = getApp();
const gData = app.globalData;

const getCanVerify = identity => Boolean(
  identity.studentId && identity.oaSecret
);

Page({

  data: {
    canVerify: false,
    identity: {
      studentId: "",
      oaSecret: "",
    }
  },

  handlerGohomeClick,
  handlerGobackClick,
  onShareAppMessage,

  bindId(e) {
    this.setData({
      "identity.studentId": e.detail.value,
      canVerify: getCanVerify(this.data.identity)
    })
  },

  bindSecret(e) {
    this.setData({
      "identity.oaSecret": e.detail.value,
      canVerify: getCanVerify(this.data.identity)
    })
  },

  verify() {

    const identity = this.data.identity;

    if (identity.studentId === "") {
      wx.showModal({ content: "请输入学号", showCancel: false })
    } else if (identity.oaSecret === "") {
      wx.showModal({ content: "请输入OA密码", showCancel: false })
    } else {

      this.setData({ identity });
      wx.setStorageSync("identity", identity);

      // 认证 POST identity
      request({
        method: "POST",
        url: `${gData.apiUrl}/user/${gData.uid}/identity`,
        header: getHeader("urlencoded", gData.token),
        data: identity,
      }).then(
        res => {

          console.log("POST identity", res);

          Object.assign(gData, { identity, verified: true });
          wx.setStorageSync("identity", identity);
          wx.setStorageSync("verified", true);

          wx.showModal({
            title: "认证成功",
            content: "认证成功！",
            showCancel: false,
            confirmText: "回到主页",
            success: res => res.confirm && wx.navigateBack({delta: 1})
          });

        }
      ).catch(
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

    }

  },

  onLoad() {

    const identity = gData.identity;

    typeof identity === "object" &&
    "studentId" in identity &&
    "oaSecret" in identity &&
    this.setData({
      identity, canVerify: getCanVerify(identity)
    });

  },

  onReady() {

    !gData.signPrivacyConfirm &&
    wx.showModal({
      title: "隐私信息提示",
      content:
        "小程序部分功能（如闲置交易、课程表）需要验证并" +
        "使用您的身份信息，以提供功能或保证交易安全。",
      confirmText: "我已知晓",
      confirmColor: "#4B6DE9",
      cancelText: "我拒绝",
      success: result => {
        if (!result.confirm) {
          this.handlerGobackClick();
        } else {
          gData.signPrivacyConfirm = true;
          wx.setStorageSync("signPrivacyConfirm", true);
        }
      }
    });

  },

  // onShow() {}

})
