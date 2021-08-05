// stuInfoDetail.js
import {
  handlerGohomeClick,
  handlerGobackClick
} from '../../../utils/navBarUtils'

var app = getApp();
const requestUtils = require('../../../utils/requestUtils');

Page({
  data: {
    show: false,
    userDetail: null,
    motto: 'Hey!',
    avatarUrl: "",
    nickName: "",
  },

  handlerGohomeClick,
  handlerGobackClick,

  /**
   * 页面数据重新加载
   */
  pageDataInit() {
    let url = "";
    let data = {};
    let header = {};
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    url = `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}`;
    data = { "secret": app.globalData.userInfo.secret };
    header = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${app.globalData.token}`,
    };

    // 获取新生信息
    var getFreshman = requestUtils.doGET(url, data, header).then(res => {
      // 更新全局变量
      app.globalData.userDetail = res.data.data;
      wx.setStorageSync("userDetail", res.data.data);
      this.setData({
        userDetail: app.globalData.userDetail,
        avatarUrl: app.globalData.avatarUrl,
        nickName: app.globalData.nickName
      });
      return res;
    });

    getFreshman.then(() => {
      wx.hideLoading();
      console.log("数据处理完成");
      this.setData({ show: true });
    }).catch(res => {
      wx.hideLoading(); // 取消加载框
      wx.showModal({
        title: "哎呀，出错误了 >.<",
        content: (
          res.error == requestUtils.REQUEST_ERROR ? "业务逻辑错误"
          : res.error == requestUtils.NETWORK_ERROR ? "网络不在状态"
          : "未知错误"
        ),
        showCancel: false
      });
    });

  },

  unavaliableNotice: () => wx.showModal({
    title: "暂不可用",
    content: "报道指南更新中，暂不可用，敬请谅解~",
    confirmText: "知道了",
    showCancel: false
  }),

  onLoad() {
    this.setData({ show: false });
    console.log('页面 stuInfoDetail onLoad...');
  },

  onShow() {
    const {
      navBarHeight,
      navBarExtendHeight,
    } = getApp().globalSystemInfo;
    this.setData({
      navBarCurrentHeight: navBarExtendHeight + navBarHeight
    })
    console.log("页面 stuInfoDetail onShow...");
    this.pageDataInit();
  },

  onReady() {
    console.log("页面 stuInfoDetail onReady!");
  },

  onShareAppMessage() {
    return {
      title: "上应小风筝",
      path: "pages/index/index"
    }
  }

})
