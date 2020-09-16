//app.js
const requestUtils = require('./utils/requestUtils');
const promisify = require('./utils/promisifyUtils');
const wxGetSetting = promisify(wx.getSetting);
const wxGetUserInfo = promisify(wx.getUserInfo);
const wxShowModal = promisify(wx.showModal);
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
    // 更新版本处理
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("检查新版本信息");
      console.log(`是否包含新版本：${res.hasUpdate}`);
    });
    updateManager.onUpdateReady(function () {
      wxShowModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
      }).then(res => {
        if (res.confirm) {
          // 清理本地缓存
          // wx.clearStorageSync();
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate();
        }
      });
    });
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      wxShowModal({
        title: '更新提示',
        content: '新版本下载失败, 请稍后重试!',
        showCancel: false,
        confirmText: '好的',
        confirmColor: '#4B6DE9',
      }).then(res => { console.log("新版本下载失败") });
    });

    // 获取本地变量
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
    const isAllStorageOk = this.globalData.uid !== "" && this.globalData.token !== "" && this.globalData.isStudent !== "";
    wxGetSetting().then(res => {
      if (res.authSetting['scope.userInfo']) {
        wxGetUserInfo().then(res => {
          that.globalData.nickName = res.userInfo.nickName;
          that.globalData.userAvatar = res.userInfo.avatarUrl;
          // 确认所需全局变量正常 否则重新登录获取
          if (isAllStorageOk) {
            that.globalData.isLogin = true;
          }
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
