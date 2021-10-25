// 实名认证
// pages/verify/verify.js

// import { handlerGohomeClick, handlerGobackClick } from "../../utils/navBarUtils";
import onShareAppMessage from "../../utils/onShareAppMessage";
import request   from "../../utils/request";
import getHeader from "../../utils/getHeader";
import { check, isNonEmptyString } from "../../utils/type";

const app = getApp();
const gData = app.globalData;

Page({

  data: {
    showHint: true,
    canVerify: false,
    url: null,
    identity: { studentId: "", oaSecret: "" }
  },

  // handlerGohomeClick,
  // handlerGobackClick,
  onShareAppMessage,

  onLoad(options) {

    const identity = gData.identity;

    check(identity, "Object", { has: [ "studentId", "oaSecret" ] }) &&
    this.setData({ identity });
    this.setCenVerify();

    const url = options.url;
    if ("url" in options) {
      if (isNonEmptyString(url)) {
        this.data.url = url;
      } else {
        console.warn("页面参数 url 不是非空字符串，认证后将不会跳转", url);
      }
    }

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

  setCenVerify() {
    this.setData({
      canVerify: [ "studentId", "oaSecret" ].every(
        prop => this.data.identity[prop] !== ""
      )
    })
  },

  bindId(e) {
    this.setData({ "identity.studentId": e.detail.value });
    this.setCenVerify();
  },

  bindSecret(e) {
    this.setData({ "identity.oaSecret": e.detail.value });
    this.setCenVerify();
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

          const url = this.data.url;
          wx.showModal({
            title: "认证成功",
            content: "认证成功！您将能够使用课表、成绩等需要认证的功能。",
            showCancel: false,
            confirmText: "返回",
            success: res => res.confirm && (
              url !== null
              ? wx.redirectTo({ url })
              : wx.navigateBack({ delta: 1 })
            )
          });

        }
      ).catch(
        err => wx.showModal({
          title: "哎呀，出错误了 >.<",
          content: `错误信息：${
            err.symbol === request.symbols.codeNotZero &&
            typeof err.data.msg === "string"
            ? err.data.msg
            : err.msg
          }`,
          showCancel: false
        })
      );

    }

  },

  toggleHint() {
    const showHint = !this.data.showHint;
    this.setData({ showHint });
    showHint && ( // 如果是在展开而不是收起提示
        () => setTimeout( // 那么展开动画结束后，将页面滚动至提示最下方
          () => wx.pageScrollTo({ selector: ".hint-last", duration: 100 }), 201
        )
      )
  }

})
