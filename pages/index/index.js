//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    menu_list: [{
        text: "通知",
        iconPath: "/asset/icon/icon_6h444ajjwem/通知.png"
      },
      {
        text: "活动",
        iconPath: "/asset/icon/icon_6h444ajjwem/tuandui.png"
      },
      {
        text: "闲置",
        iconPath: "/asset/icon/icon_6h444ajjwem/dianpu.png"
      }, {
        text: "失物",
        iconPath: "/asset/icon/icon_6h444ajjwem/sousuo.png"
      }, {
        text: "教务",
        iconPath: "/asset/icon/icon_6h444ajjwem/kecheng.png"
      }, {
        text: "分享",
        iconPath: "/asset/icon/icon_6h444ajjwem/fenxiang.png"
      }
    ]
  },
  onShow: function (e) {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  }
})