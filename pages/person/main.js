// pages/test/main.js
const app = getApp()
Page({
      data: {
        userInfo: "",
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        imageUrl: "/asset/icon/头像 (2).png"
      },
      methods: {
        login: function (e) {
          console.log(e)
          if (e.detail.userInfo) {
            this.setData({
              userInfo: e.detail.userInfo.nickName,
              imageUrl: e.detail.userInfo.avatarUrl
            })
          }
        }},
        onShow: function (e) {
          if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
              selected: 1
            })
          }
        }})