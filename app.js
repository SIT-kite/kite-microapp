//app.js
App({
  globalData: {
    nickName: null,
    userAvater: null,
    isLogin: false,
    isStudent: false,
    commonUrl: "https://kite.sunnysab.cn/api/v1",
    uid: 0,
    token: null
  },
  onShow: function () {
    const that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success(res) {
              console.log(that)
              that.globalData.nickName = res.userInfo.nickName
              that.globalData.userAvater = res.userInfo.avatarUrl
              that.globalData.isLogin = true
              wx.login({
                success(res) {
                  if (res.code) {
                    wx.request({
                      url: `${that.globalData.commonUrl}/session`,
                      method: "POST",
                      header: {
                        "content-type": "application/x-www-form-urlencoded"
                      },
                      data: {
                        loginType: 0,
                        wxCode: res.code
                      },
                      success: function (res) {
                        if (res.data.code === 0) {
                          console.log(res)
                          that.globalData.token = res.data.data.token
                          that.globalData.uid = res.data.data.data.uid
                          wx.request({
                            url: `${that.globalData.commonUrl}/user/${that.globalData.uid}/identity`,
                            method: "GET",
                            header: {
                              "content-type": "application/x-www-form-urlencoded",
                              "Authorization": `Bearer ${that.globalData.token}`
                            },
                            success: function (res) {
                              if (res.data.code === 0) {
                                that.globalData.isStudent = true
                              } else {
                                that.globalData.isStudent = false
                              }
                            }
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
  },
})
