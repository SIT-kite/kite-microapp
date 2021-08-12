// pages/welcome/welcome.js
const app = getApp();
import onShareAppMessage from "../../js/onShareAppMessage";

Page({

  // data: {},

  onShareAppMessage,

  router() {

    // 首次进入需要完善个人信息
    wx.redirectTo({
      url: "/freshman/pages" + (
        app.globalData.userDetail !== null
        ? "/stuInfoDetail/stuInfoDetail"
        : "/inputInfo/inputInfo?isHidden=flex"
      ),
    });

  },

  // onLoad() {},
  // onReady() {}

})
