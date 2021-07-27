// pages/welcome/welcome.js
const app = getApp();

Page({

  data: {},

  gotoStuInfoDetail() {

    // 第一次进入这个页面 则需要完善个人信息
    try {
      var userDetail = wx.getStorageSync('userDetail')
    } catch (e) {
      console.log(e)
    }
    wx.redirectTo({
      url: "/freshman/pages" + (
        userDetail == '' || userDetail == null
        ? "/inputInfo/inputInfo?isHidden=flex"
        : "/stuInfoDetail/stuInfoDetail"
      ),
    });
     
  },

  onLoad() {},
  onReady() {}

})
