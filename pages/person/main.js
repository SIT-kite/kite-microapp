// pages/test/main.js
const app = getApp()
Page({
  data: {
    userInfo: "",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imageUrl: "/asset/icon/face.png",
    image: ""
  },
  login: function (e) {
    console.log(e)
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo.nickName,
        imageUrl: e.detail.userInfo.avatarUrl
      })
    }
  },
  onShow: function (e) {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },
  uploadfile: function () {
    wx.chooseImage({
      success: (res) => {
        wx.uploadFile({
          filePath: res.tempFilePaths[0],
          name: 'name',
          url: 'http://127.0.0.1:3000',
          success: (res)=>{
            console.log("上传成功")
          },
          fail:(res)=>{
            console.log(res)
            console.log("上传失败")
          }
        })
        console.log(res.tempFilePaths)
      }
    })
  }
})