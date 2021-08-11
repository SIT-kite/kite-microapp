// 主页
// pages/index/index.js
import getHeader from "../../utils/getHeader";

const app = getApp();

Page({
  data: {
    isLogin: false,
    clicked: -1, // 被点击功能的索引
    notice: [], // 通知
    items: [{
      text: "迎新",
      url: "/freshman/pages/welcome/welcome",
      iconPath: "/assets/icons/index/freshman.png"
    }, {
      text: "电费",
      url: "/electricity/pages/show/show",
      iconPath: "/assets/icons/index/electricity.png"
    }, {
      text: "商城",
      url: "/shop/pages/index/index",
      iconPath: "/assets/icons/index/shop.png"
    }, {
      text: "空教室",
      url: "/class-room/pages/available-room",
      iconPath: "/assets/icons/index/availroom.png"
    }, {
      text: "拼车",
      url: "/carpool/pages/car-pool/car-pool",
      iconPath: "/assets/icons/index/carpool.png"
    }, /* {
      text: "常用电话",
      url: "/contact/pages/show/show",
      iconPath: "/assets/icons/index/telephone.png"
    }, */
    {
      text: "搜索",
      url: "/search/pages/index/index",
      iconPath: "/assets/icons/index/search.png"
    }]
  },

  onLoad() {
    this.setData({isLogin: app.globalData.isLogin});
    // 获取并设置通知 notice
    wx.request({
      method: "GET",
      url: `${app.globalData.commonUrl}/notice`,
      header: getHeader("urlencoded", app.globalData.token),
      success: res => {
        const notice = res.data.data;
        this.setData({ notice });
        console.log("通知数据：", notice);
      },
      fail: console.error
    });
  },

  router(e) {

    const dataset = e.currentTarget.dataset;

    // 设置被点击功能索引 clicked，为图标显示点击动画
    this.setData({ clicked: dataset.index });
    // 一秒后重置
    setTimeout(() => this.setData({ clicked: -1 }), 1000);

    let url = dataset.url;

    // 如果点击“迎新”但是 userDetail 不为空，则直接跳转到 stuInfoDetail
    if (
      url === "/freshman/pages/welcome/welcome" &&
      app.globalData.userDetail !== null
    ) {
      url = "/freshman/pages/stuInfoDetail/stuInfoDetail";
    }

    app.globalData.isLogin
      // 已登录，跳转到目标页面
      ? wx.navigateTo({
        url,
        fail: () => wx.showModal({ // 页面跳转失败时，显示未完成
          title: "尚未完成",
          content: "别急别急，正在努力开发~",
          confirmText: "知道了",
          showCancel: false
        })
      })
      // 未登录，提示用户登录
      : wx.showModal({
        title: "请登录",
        content: "尚未登录，请前往登录",
        success: res =>
          res.confirm &&
          wx.switchTab({ url: "/pages/user/user" })
      });

  },

  goTemp() {
    wx.navigateTo({
      url: "/freshman/pages" + (
        app.globalData.userDetail !== null
          ? "/stuInfoDetail/stuInfoDetail"
          : "/welcome/welcome"
      )
    });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
  },

  onShareAppMessage: () => ({
    title: "上应小风筝",
    path: "pages/index/index"
  })

})
