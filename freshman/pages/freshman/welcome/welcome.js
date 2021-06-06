// pages/welcome/welcome.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  gotoStuInfoDetail:function () {

    // 第一次进入这个页面 则需要完善个人信息
    const userDetail = app.globalData.userDetail;
    wx.redirectTo({
      url: "/freshman/pages/freshman" + (
        userDetail == '' || userDetail == null
        ? "/inputInfo/inputInfo?isHidden=flex"
        : "/stuInfoDetail/stuInfoDetail"
      ),
    });
     
  },

  onLoad() {

  },


  onReady() {

  }

})