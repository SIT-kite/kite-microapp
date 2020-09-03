// pages/person/person.js
const app = getApp();
const url = app.globalData.commonUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: {
      wrong: "/asset/icon/wrong.png",
      right: "/asset/icon/right.png"
    }
  },
  go_signup: function () {
    wx.navigateTo({
      url: '/pages/signup/signup'
    })
  },
  login: function (e) {
    const that = this;
    console.log(that);
    console.log(e.detail.userInfo);
    if (e.detail.userInfo) {
      wx.login({
        success(res) {
          if (res.code) {
            console.log(res.code);
            wx.showLoading({
              title: '加载中',
            })
            wx.request({
              url: `${url}/session`,
              method: "POST",
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              data: {
                loginType: 0,
                wxCode: res.code
              },
              success: function (res) {
                console.log(res)
                if (res.data.code === 0) {
                  app.globalData.token = res.data.data.token
                  app.globalData.uid = res.data.data.data.uid
                  wx.request({
                    url: `${url}/user/${app.globalData.uid}/identity`,
                    method: "GET",
                    header: {
                      "content-type": "application/x-www-form-urlencoded",
                      "Authorization": `Bearer ${app.globalData.token}`
                    },
                    success: function (res) {
                      if (res.data.code === 0) {
                        that.setData({
                          isStu: true
                        })
                        app.globalData.isStudent = true
                      } else {
                        that.setData({
                          isStu: false
                        })
                        app.globalData.isStudent = false
                      }
                      wx.hideLoading();
                    }
                  })
                } else {
                  wx.request({
                    url: `${url}/user`,
                    method: "POST",
                    header: {
                      "content-type": "application/x-www-form-urlencoded"
                    },
                    data: {
                      nickName: that.data.nickName,
                      avatarUrl: that.data.avater
                    },
                    success: function (res1) {
                      app.globalData.uid = res1.data.data.uid
                      app.globalData.token = res1.data.data.token
                      wx.login({
                        success: function (res) {
                          wx.request({
                            url: `${url}/user/${res1.data.data.uid}/authentication`,
                            method: 'POST',
                            data: {
                              loginType: 0,
                              wxCode: res.code
                            },
                            header: {
                              "content-type": "application/x-www-form-urlencoded",
                              "Authorization": `Bearer ${res1.data.data.token}`
                            }
                          })
                        }
                      })

                    }
                  });
                  wx.hideLoading();
                }
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
      app.globalData.nickName = e.detail.userInfo.nickName
      app.globalData.userAvatar = e.detail.userInfo.avatarUrl
      app.globalData.isLogin = true
      this.setData({
        nickName: app.globalData.nickName,
        avater: app.globalData.userAvatar,
        isLogin: app.globalData.isLogin,
      });

    }
  },
  moveToAbout: function(e){
    console.log("进入跳转按钮")
    wx.navigateTo({
      url: '/pages/about/about',
      success: (result)=>{
        console.log("跳转至 关于我们 页面")
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("page onload")
    this.setData({
      nickName: app.globalData.nickName,
      avater: app.globalData.userAvatar,
      isLogin: app.globalData.isLogin,
      isStu: app.globalData.isStudent
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("page onready")
    this.setData({
      nickName: app.globalData.nickName,
      avater: app.globalData.userAvatar,
      isLogin: app.globalData.isLogin,
      isStu: app.globalData.isStudent
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    };
    this.setData({
      nickName: app.globalData.nickName,
      avater: app.globalData.userAvatar,
      isLogin: app.globalData.isLogin,
      isStu: app.globalData.isStudent
    });
    console.log("person 被展示")

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})