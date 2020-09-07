//app.js
App({
  globalData: {
    nickName: null,
    userAvatar: null,
    isLogin: false,
    isStudent: false,
    commonUrl: "https://kite.sunnysab.cn/api/v1",
    uid: 0,
    // 登录需要的授权码
    token: "",
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
      console.log("Storage userDetail:" + userDetail);
      console.log("Storage userInfo:" + userInfo);
      this.globalData.userDetail = userDetail;
      this.globalData.userInfo = userInfo;
    } catch (error) {
      console.log("获取Storage变量出错");
    }
  },
  onShow: function () {
    const that = this;
    wx.getSetting({
      success(res) {
        // 判断是否授权个人信息
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            // 获取用户信息
            success(userinfo_res) {
              console.log("获取用户Open Type信息成功")
              console.log(userinfo_res);
              that.globalData.nickName = userinfo_res.userInfo.nickName
              that.globalData.userAvatar = userinfo_res.userInfo.avatarUrl
              that.globalData.isLogin = true
              wx.login({
                success(res) {
                  if (res.code) {
                    // Session获取uid
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
                          // 用户已注册
                          that.globalData.token = res.data.data.token;
                          that.globalData.uid = res.data.data.data.uid;
                          // 获取实名认证状态以及StudentId
                          wx.request({
                            url: `${that.globalData.commonUrl}/user/${that.globalData.uid}/identity`,
                            method: "GET",
                            header: {
                              "content-type": "application/x-www-form-urlencoded",
                              "Authorization": `Bearer ${that.globalData.token}`
                            },
                            success: function (res) {
                              console.log("获取实名认证信息成功")
                              console.log(res)
                              if (res.data.code === 0) {
                                that.globalData.studentId = res.data.data.studentId
                                that.globalData.isStudent = true
                              } else {
                                that.globalData.isStudent = false
                              }
                              
                              // 更新用户信息
                              var reqTask = wx.request({
                                url: `${that.globalData.commonUrl}/user/${that.globalData.uid}`,
                                data: userinfo_res.userInfo,
                                header: {
                                  "content-type": "application/x-www-form-urlencoded",
                                  "Authorization": `Bearer ${that.globalData.token}`
                                },
                                method: 'PUT',
                                success: (res)=>{
                                  // 修改成功
                                  if(res.data.code === 0){
                                    console.log("更新用户信息成功");
                                  }else{
                                    console.log("更新用户信息失败");
                                  }
                                },
                                fail: (res)=>{
                                  console.log("更新用户信息出现问题");
                                  console.log(res);
                                },
                                complete: ()=>{}
                              });
                            }
                          });
                        }
                        else {
                          // 不存在用户则创建用户
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
