//index.js
//获取应用实例
import {
  handlerGohomeClick,
  handlerGobackClick
} from '../../../../utils/navBarUtils'

var app = getApp();
const requestUtils = require('../../../../utils/requestUtils');

Page({
  data: {
    show: false,
    userDetail: null,
    motto: 'Hey!',
    avatarUrl: "",
    nickName: "",
  },

  /**
   * 导航栏handler函数
   */
  handlerGohomeClick: handlerGohomeClick,
  /**
   * 导航栏handler函数
   */
  handlerGobackClick: handlerGobackClick,

  /**
   * 跳转至报到指南页面 
   *
   */
  gotoNavigate: function () {
    wx.navigateTo({
      url: '/freshman/pages/freshman/navigate/navigate',
    });
  },

  /**
   * 页面数据重新加载
   */
  pageDataInit: function () {
    let url = "";
    let data = {};
    let header = {};
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    url = `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}`;
    data = {
      "secret": `${app.globalData.userInfo.secret}`
    };
    header = {
      "content-type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${app.globalData.token}`,
    };

    // 获取新生信息
    var getFreshman = requestUtils.doGET(url, data, header).then(res => {
      // 更新全局变量
      app.globalData.userDetail = res.data.data;
      wx.setStorageSync("userDetail", res.data.data);
      this.setData({
        userDetail: app.globalData.userDetail,
        avatarUrl: app.globalData.userAvatar,
        nickName: app.globalData.nickName
      });
      return res;
    });
    getFreshman.then(res => {
      // 取消加载框
      wx.hideLoading();
      console.log("数据处理完成");
      this.setData({ show: true });
    }).catch(res => {
      // 取消加载框
      wx.hideLoading();
      if (res.error == requestUtils.REQUEST_ERROR) {
        console.log(res);
        wx.showModal({
          title: "哎呀，出错误了>.<",
          content: "业务逻辑错误",
          showCancel: false,
        });
      }
      if (res.error == requestUtils.NETWORK_ERROR) {
        wx.showModal({
          title: "哎呀，出错误了>.<",
          content: "网络不在状态",
          showCancel: false,
        });
      }
    });
  },

  gotoAnalysis: function () {
    wx.navigateTo({
      url: '/freshman/pages/freshman/shareAnalysis/shareAnalysis',
      success: (result) => {
        console.log("跳转分享页面成功")
      },
      fail: () => { },
      complete: () => { }
    });
  },

  gotoModify(e) {
    console.log("gotoModify");
    wx.navigateTo({
      url: '/freshman/pages/freshman/inputInfo/inputInfo?isHidden=none',
    })
  },

  gotoNewFriend(e) {
    console.log("gotoNewFriend");
    wx.navigateTo({
      url: '/freshman/pages/freshman/newFriend/newFriend',
    })
  },

  gotoClass(e) {
    console.log("gotoNewClass");
    wx.navigateTo({
      url: '/freshman/pages/freshman/newClass/newClass',
    })
  },

  onLoad: function () {
    this.setData({ show: false });
    console.log('页面 stuInfoDetail onLoad...');

  },
  onShow: function () {
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
  onReady: function () {
    console.log("页面 stuInfoDetail onReady!");
  },
  onShareAppMessage: function (e) {
    return {
      title: "上应小风筝",
      path: "pages/index/index"
    }
  }

})