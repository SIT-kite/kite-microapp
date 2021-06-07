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
    userInfo: {},
    contact: {},
    userDetail: null,
    classmates: null,
    roommates: null,
    familiar: null,
    isPrivacyConfirmed: false,
  },

  updateManager() {

    // 更新版本
    const updateManager = wx.getUpdateManager();
  
    updateManager.onCheckForUpdate(
      res => console.log(`检查新版本信息\n是否包含新版本：${res.hasUpdate}`)
    );

    updateManager.onUpdateReady(() => {
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

    updateManager.onUpdateFailed(() => {
      // 新版本下载失败
      wxShowModal({
        title: '更新提示',
        content: '新版本下载失败, 请稍后重试！',
        confirmText: '好的',
        showCancel: false
      }).then(
        () => console.log("新版本下载失败")
      );
    });

  },

  onLaunch() {
    this.updateManager();

    const globalData = this.globalData;
  
    // 获取本地变量
    [
      "userDetail", "userInfo", "token", "uid",
      "isStudent", "isPrivacyConfirm", "freshmanPrivacyConfirm"
    ].forEach(
      key => wx.getStorage({
        key,
        success: res => globalData[key] = res.data,
        fail: res => {
          if (res === "getStorage:fail data not found") {
            console.log(`找不到变量 ${key}，回退为空字符串`);
          }
          globalData[key] = "";
        }
      })
    );
  
  },


  onShow() {
    // 更新
    const gData = this.globalData;
    const isAllStorageOk =
      [ "uid", "token", "isStudent" ].every( key => gData[key] !== "" );

    console.log("基本变量：", {
      isAllStorageOk,
      uid: gData.uid,
      token: gData.token,
      isStudent: gData.isStudent
    });

    wxGetSetting().then(res => {

      if (res.authSetting['scope.userInfo']) {

        wxGetUserInfo().then(res => {

          gData.nickName = res.userInfo.nickName;
          gData.userAvatar = res.userInfo.avatarUrl;
          console.log("昵称与头像：", {
            nickName: gData.nickName,
            userAvatar: gData.userAvatar
          });

          // 确认所需全局变量正常 否则重新登录获取
          if (isAllStorageOk) {
            gData.isLogin = true;
          }

          if (gData.uid != "") {
            // put 更新用户头像
            const url = `${gData.commonUrl}/user/${gData.uid}`
            const data = res.userInfo;
            const header = {
              "content-type": "application/x-www-form-urlencoded",
              "Authorization": `Bearer ${gData.token}`
            };
            requestUtils.doPUT(url, data, header).catch(res => {
              console.log("用户头像更新失败", res);
            });
          }

        });

      }

    });

  }

})
