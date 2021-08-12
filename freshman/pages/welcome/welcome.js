// pages/welcome/welcome.js
const app = getApp();

Page({

  // data: {},

  router() {

    // 第一次进入这个页面 则需要完善个人信息
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
