//app.js
import getHeader from "./utils/requestUtils.getHeader";
const requestUtils = require('./utils/requestUtils');
const promisify    = require('./utils/promisifyUtils');
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
      wx.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？"
      }).then(res => {
        if (res.confirm) {
          // wx.clearStorageSync(); // 清理本地缓存
          updateManager.applyUpdate();
        }
      });
    });

    updateManager.onUpdateFailed(() => {
      // 新版本下载失败
      wx.showModal({
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

    // setGlobalData(key): Promise
    const setGlobalData = key => wx.getStorage({key}).then(
      res => this.globalData[key] = res.data
    ).catch(
      res => {
        console.warn(`key ${key} 获取失败，回退为空字符串`, res);
        this.globalData[key] = "";
      }
    );

    // 从本地缓存 Storage 中获取并设置全局数据 globalData
    const keys = [
      "uid", "token", "isStudent", "userInfo", "userDetail",
      "isPrivacyConfirm", "freshmanPrivacyConfirm"
    ];
    Promise.allSettled( keys.map(setGlobalData) ).then(() => {

      // 按照用户 id、token 和是否实名来判断登录状态
      this.globalData.isLogin = [ "uid", "token", "isStudent" ].every(
        key => !!this.globalData[key]
      );

      // 获取用户设置
      // 到现在这里边只有用户授权设置啊…
      // 微信就不能先单独来个 wx.getAuthSetting() 吗…
      wx.getSetting().then(res => {
        // console.log("用户设置 wx.getSetting():", res);

        // 是否已授权获取用户信息
        if (res.authSetting["scope.userInfo"]) {

          // 使用 wx.getUserInfo() 获取并设置用户昵称与头像，并按 uid 更新用户数据
          wxGetUserInfo({ lang: "zh_CN" }).then(res => {

            const gData = this.globalData;
            const userInfo = res.userInfo;

            // 设置用户昵称与头像
            gData.nickName   = userInfo.nickName;
            gData.userAvatar = userInfo.avatarUrl;

            // globalData 设置完成
            console.log("全局数据 globalData:", gData);
            console.log("用户信息 userInfo:", userInfo);

            // 无视登录状态，只要有 uid，就向服务器更新用户数据
            if (gData.uid !== 0) {

              const putError = (msg, res) =>
                console.error("用户信息更新失败，" + msg, res);

              wx.request({
                method: "PUT",
                url: `${gData.commonUrl}/user/${gData.uid}`,
                header: getHeader("urlencoded", gData.token),
                data: res.userInfo,
                success: res =>
                res.data.code !== 0 &&
                  putError(
                    res.data.code === 120 ? "账号不存在" : "未知错误",
                    res
                  ),
                fail: res => putError("请求失败", res)
              });
            }

          });

        }

      });

    });

  },

  onShow() {
    
  }

})
