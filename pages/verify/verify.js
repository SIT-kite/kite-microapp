// 实名认证
// pages/verify/verify.js

// import { handlerGohomeClick, handlerGobackClick } from "../../utils/navBarUtils";
import onShareAppMessage from "../../utils/onShareAppMessage";
import request   from "../../utils/request";
import getHeader from "../../utils/getHeader";
import { check } from "../../utils/type";

const app = getApp();
const gData = app.globalData;

Page({

  data: {
    showHint: false,
    canVerify: false,
    identity: { studentId: "", oaSecret: "" }
  },

  // handlerGohomeClick,
  // handlerGobackClick,
  onShareAppMessage,

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

  toggleHint() {
    const showHint = !this.data.showHint;
    this.setData({ showHint });
    showHint && ( // 如果是在展开而不是收起提示
        () => setTimeout( // 那么展开动画结束后，将页面滚动至提示最下方
          () => wx.pageScrollTo({ selector: ".hint-last", duration: 100 }), 201
        )
      )
  },

  onLoad() {

    const identity = gData.identity;

    check(identity, "Object", { has: [ "studentId", "oaSecret" ] }) &&
    this.setData({ identity });
    this.setCenVerify();

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
