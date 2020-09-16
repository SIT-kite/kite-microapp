//app.js
const requestUtils = require('./utils/requestUtils');
const promisify = require('./utils/promisifyUtils');
const wxGetSetting = promisify(wx.getSetting);
const wxGetUserInfo = promisify(wx.getUserInfo);
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
      var token = wx.getStorageSync("token");
      var uid = wx.getStorageSync("uid");
      var isStudent = wx.getStorageSync("isStudent");
      this.globalData.userDetail = userDetail;
      this.globalData.userInfo = userInfo;
      this.globalData.token = token;
      this.globalData.uid = uid;
      this.globalData.isStudent = isStudent;
    } catch (error) {
      console.log("获取Storage变量出错");
    }
  },
  onShow: function () {
    // 更新
    const that = this;
    wxGetSetting().then(res => {
      if (res.authSetting['scope.userInfo']) {
        wxGetUserInfo().then(res => {
          that.globalData.nickName = res.userInfo.nickName;
          that.globalData.userAvatar = res.userInfo.avatarUrl;
          that.globalData.isLogin = true;
          if (that.globalData.uid != "") {
            // put 更新用户信息
            let url = `${that.globalData.commonUrl}/user/${that.globalData.uid}`
            let data = res.userInfo;
            let header = {
              "content-type": "application/x-www-form-urlencoded",
              "Authorization": `Bearer ${that.globalData.token}`
            };
            requestUtils.doPUT(url, data, header).catch(res => {
              console.log("更新用户数据失败");
              console.log(res);
            });
          }
        });
      }
    });
  },
})
