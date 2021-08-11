// 主页
// pages/person/person.js
import getHeader from "../../utils/requestUtils.getHeader";
import request from "../../utils/request";

const app = getApp();

// 谁有空了！把它放进 menuList 里！就没这么多事了！！！
const pageMap = new Map([
  ["welcome",     "/freshman/pages/welcome/welcome"],
  ["electricity", "/electricity/pages/show/show"],
  ["shop",        "/shop/pages/index/index"],
  ["avail-room",  "/class-room/pages/available-room"],
  ["carpool",     "/carpool/pages/car-pool/car-pool"],
  // [ "contact",    "/contact/pages/show/show"],
  ["search",      "/search/pages/index/index"]
])

Page({
  data: {
    clicked: -1, // 被点击功能的索引
    notice: [], // 通知
    menuList: [{
      name: "welcome",
      text: "迎新",
      iconPath: "/assets/icons/index/freshman.png"
    }, {
      name: "electricity",
      text: "电费",
      iconPath: "/assets/icons/index/electricity.png"
    }, {
      name: "shop",
      text: "商城",
      iconPath: "/assets/icons/index/shop.png"
    }, {
      name: "avail-room",
      text: "空教室",
      iconPath: "/assets/icons/index/availroom.png"
    }, {
      name: "carpool",
      text: "拼车",
      iconPath: "/assets/icons/index/carpool.png"
    }, // {
    //   name: "contact",
    //   text: "常用电话",
    //   iconPath: "/assets/icons/index/telephone.png"
    // },
    {
      name: "search",
      text: "搜索",
      iconPath: "/assets/icons/index/search.png"
    }]
  },

  onLoad() {
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
    console.log("被点击元素 dataset", dataset);

    // 设置被点击功能索引 clicked，为图标显示点击动画
    this.setData({ clicked: dataset.index });
    // 一秒后重置
    setTimeout(() => this.setData({ clicked: -1 }), 1000);

    const pageName = dataset.name;
    let url = pageMap.get(pageName);

    if (url === undefined) {
      console.error("找不到对应的 url", { pageName, url });
      throw "找不到对应的 url";
    }

    // 如果点击“迎新”但是 userDetail 不为空，则直接跳转到 stuInfoDetail
    try {
      var userDetail = wx.getStorageSync('userDetail')
    } catch (e) {
      console.log(e)
    }
    if (pageName === "welcome" && userDetail !== "" && userDetail != null) {
      url = "/freshman/pages/stuInfoDetail/stuInfoDetail";
    }

    console.log("导航到：" + url);

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
        wx.switchTab({
          url: '/pages/person/person'
        })
      });

  },

  goTemp() {
    const userDetail = app.globalData.userDetail;
    wx.navigateTo({
      url: "/pages" + (
        userDetail != "" && userDetail != null
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

  onShareAppMessage() {
    return {
      title: "上应小风筝",
      path: "pages/index/index"
    };
  }

})
