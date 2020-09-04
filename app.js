//app.js
App({
  globalData: {
    visible: true,
    nickName: null,
    userAvatar: null,
    isLogin: false,
    isStudent: false,
    commonUrl: "https://kite.sunnysab.cn/api/v1",
    uid: 0,
    // 登录需要的授权码
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc19hZG1pbiI6dHJ1ZSwidWlkIjoxMH0.tY2adWTqpK21lqquSbxYLT3Zvwn83q8K0U0J59oeeFM",
    // 用户在inputInfo界面输入的个人信息（准考证/姓名，身份证后六位）
    userInfo: {
    },
    contact: {
    },
    userDetail: null,
    classmates: null,
    roommates: null,
    familiar: null
  },
  onLaunch: function () {
    try {
      var userDetail = wx.getStorageSync("userDetail");
      var userInfo = wx.getStorageSync("userInfo");
      console.log("userDetail:" + userDetail);
      this.globalData.userDetail = userDetail;
      this.globalData.userInfo = userInfo;

    } catch (error) {
      console.log(userDetail);
      console.log("获取userDetail出错");
    }
  },
  onShow: function () {
    const that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            // 获取用户的昵称 
            success(userinfo_res) {
              console.log(that);
              that.globalData.nickName = userinfo_res.userInfo.nickName
              that.globalData.userAvatar = userinfo_res.userInfo.avatarUrl
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
                              console.log(res)
                              if (res.data.code === 0) {
                                that.globalData.studentId = res.data.data.studentId
                                that.globalData.isStudent = true
                              } else {
                                that.globalData.isStudent = false
                              }
                            }
                          })
                        }
                        else {
                          wx.request({
                            url: `${that.globalData.commonUrl}/user`,
                            method: "POST",
                            header: {
                              "content-type": "application/x-www-form-urlencoded"
                            },
                            data: userinfo_res.userInfo,
                            success: function (res1) {
                              that.globalData.uid = res1.data.data.uid
                              that.globalData.token = res1.data.data.token
                              console.log(res1)
                              wx.login({
                                success: function (res) {
                                  wx.request({
                                    url: `${that.globalData.commonUrl}/user/${res1.data.data.uid}/authentication`,
                                    method: 'POST',
                                    data: {
                                      loginType: 0,
                                      wxCode: res.code
                                    },
                                    header: {
                                      "content-type": "application/x-www-form-urlencoded",
                                      "Authorization": `Bearer ${res1.data.data.token}`
                                    },
                                    success: function () {
                                      that.globalData.isStudent = false
                                    }
                                  })
                                }
                              })

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
