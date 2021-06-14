// 主页
// pages/person/person.js
const app = getApp();
const requestUtils = require("../../utils/requestUtils");

Page({
  data: {
    selected: -1,
    id: "",
    animation_data: "",
    notice:[],
    menu_list: [{
        id: "welcome",
        text: "迎新",
        iconPath: "/assets/icons/index/freshman.png"
      },
      {
        id: "electricity",
        text: "电费",
        iconPath: "/assets/icons/index/electricity.png"
      } ,
      {
        id: "avail-room",
        text: "空教室",
        iconPath: "/assets/icons/index/availroom.png"
      } ,
      {
        id: "carpool",
        text: "拼车",
        iconPath: "/assets/icons/index/carpool.png"
      },
      {
        id: "contact",
        text: "常用电话",
        iconPath: "/assets/icons/index/telephone.png"
      }
    ]
  },

  onLoad() {
    this.getNotice();
  },

  getNotice() {

    const url = `${app.globalData.commonUrl}/notice`;
    const data = {};
    const header = {
      "content-type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${app.globalData.token}`
    };

    requestUtils.doGET(url, data, header).then(res => {
      this.setData({notice: res.data.data});
      console.log("公告数据：", res.data.data);
    }).catch(
      res => console.log(res)
    );

  },

  move(e) {
    const dataset = e.currentTarget.dataset;
    this.setData({
      animation_data: "animation: living .5s ease;",
      selected: dataset.index,
      id: dataset.id
    });
    this.router(this.data.id);
  },

  router(pageId) {
    let url = new Map([
        [ "welcome", "/freshman/pages/welcome/welcome"],
        [ "electricity", "/electricity/pages/show/show"],
        [ "avail-room", "/edu/pages/available-room/show"],
        [ "carpool", "/carpool/pages/car-pool/car-pool"],
        [ "contact", "/contact/pages/show/show"]
    ]).get(pageId);
    console.log(url)
    if (url === undefined) {
      console.error("找不到对应的 url", {id: pageId, url});
      throw "找不到对应的 url";
    }

    // 如果点击新生但是 userDetail 不为空，那么直接跳入到 stuInfoDetail
    const userDetail = app.globalData.userDetail;
    if (pageId === "welcome" && userDetail !== "" && userDetail != null) {
      url = "/freshman/pages/stuInfoDetail/stuInfoDetail";
    }

    const isLogin = app.globalData.isLogin;
    if (isLogin) {
      // 已登录，跳转到目标页面
      wx.navigateTo({
        url,
        fail: () => wx.showModal({ // 页面跳转失败时，显示未完成
          title: "尚未完成",
          content: "别急别急，正在努力开发~",
          confirmText: "知道了",
          showCancel: false
        })
      })
    } else {
      // 未登录，提示用户登录
      wx.showModal({ // 页面跳转失败显示未完成
        title: "请登录",
        content: "尚未登录，请前往登录",
        success: res => res.confirm && this.goLogin()
      })
    }
  },

  goLogin() {
    wx.switchTab({
      url: '/pages/person/person'
    })
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
  },

  goTemp() {
    const userDetail = app.globalData.userDetail;
    const url = "/pages" + (
      userDetail != "" && userDetail != null
      ? "/stuInfoDetail/stuInfoDetail"
      : "/welcome/welcome"
    );
    wx.navigateTo({
      url: url,
      success: function () {
        console.log("跳转成功")
      },
      fail: function (res) {
        console.log(res);
        console.log("跳转失败")
      }
    })
  },

  goNavigate() {
    wx.navigateTo({
      url: '/pages/navigate/navigate'
    });
  },
  onShareAppMessage() {
    return {
      title: "上应小风筝",
      path: "pages/index/index"
    };
  }
})
