//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    show: false,
    showTemp: false,
    selected: -1,
    id: "",
    animation_data: "",
    menu_list: [{
        id: "qrcode",
        text: "入校码",
        iconPath: "/asset/icon/main_icon/qrcode.png"
      },
      {
        id: "activity",
        text: "活动",
        iconPath: "/asset/icon/main_icon/tuandui.png"
      },
      {
        id: "shopping",
        text: "闲置",
        iconPath: "/asset/icon/main_icon/dianpu.png"
      }, {
        id: "lost",
        text: "失物",
        iconPath: "/asset/icon/main_icon/sousuo.png"
      }, {
        id: "education",
        text: "教务",
        iconPath: "/asset/icon/main_icon/kecheng.png"
      }, {
        id: "Student_system",
        text: "新生",
        iconPath: "/asset/icon/main_icon/user.png"
      }
    ]
  },
  move: function (e) {
    this.setData({
      animation_data: "animation:living .5s ease;",
      selected: e.currentTarget.dataset.index,
      id: e.currentTarget.dataset.id
    });
    this.router(this.data.id)
  },
  router: function (id) {
    const show = !app.globalData.isLogin;
    const currenturl = id + '/' + id;
    console.log(currenturl);
    if (!show) {
      if (id === 'qrcode') {
        wx.navigateTo({
          url: `/pages/${currenturl}`,
          success: function () {}, //接口调用成功的回调函数
          fail: function () {}, //接口调用失败的回调函数
          complete: function () {} //接口调用结束的回调函数（调用成功、失败都会执行）
        })
      }else{
      this.setData({
        showTemp: true
      })}
    } else {
      this.setData({
        show: true
      })
    }
  },
  go_login: function () {
    this.setData({
      show: false
    })
    wx.switchTab({
      url: '/pages/person/person',
    })
  },
  onClose() {
    this.setData({
      show: false,
      showTemp: false
    });
  },
  onShow: function (e) {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }

  },
  go_temp: function (e) {
    wx.navigateTo({
      url: '/pages/welcome/main',
      success: function () {}, //接口调用成功的回调函数
      fail: function () {}, //接口调用失败的回调函数
      complete: function () {} //接口调用结束的回调函数（调用成功、失败都会执行）
    })
  }
})