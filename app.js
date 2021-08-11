//app.js
import updateManager from "./utils/updateManager";

App({
  globalData: {

    commonUrl: "https://kite.sunnysab.cn/api/v1",

    uid: 0,    // 用户 ID
    token: "", // 登录需要的授权码

    isLogin:   false, // 是否已登录
    isStudent: false, // 是否已实名

    nickName:  null, // 昵称
    avatarUrl: null, // 头像

    signPrivacyConfirm:     false, // 实名隐私协议
    freshmanPrivacyConfirm: false, // 迎新隐私协议

    visible: false, // 迎新 inputInfo 页面 复选框 同城可见
    userInfo: {},   // 迎新 inputInfo 页面 验证信息 姓名/考生号/准考证号，身份证后六位
    contact: {},    // 迎新 inputInfo 页面 联系方式 手机号 tel，qq，微信 wechat

    userDetail: null, // 迎新 stuInfoDetail 页面 用户详情
    classmates: null, // 迎新      newClass 页面 同班同学
    roommates:  null, // 迎新     newFriend 页面 我的室友
    familiar:   null, // 迎新     newFriend 页面 可能认识的人

    searchResultList: [],
    searchHistoryList: [],
    searchKeyWord: "",
    searchResultItemIndex: 0,

    location: {}

  },

  onLaunch() {

    updateManager();

    // 从本地存储 Storage 中获取重要属性，设置全局数据 globalData

    const storage = Object.fromEntries(
      wx.getStorageInfoSync().keys.map(
        key => [ key, wx.getStorageSync(key) ]
      )
    );

    [
      "uid", "token", "isStudent", "userInfo", "userDetail",
      "signPrivacyConfirm", "freshmanPrivacyConfirm"
    ].forEach(
      key => {
        if (key in storage) {
          this.globalData[key] = storage[key];
        }
      }
    );

    console.log(
      "本地存储 Storage:", Object.fromEntries(
        wx.getStorageInfoSync().keys.map(
          key => [ key, wx.getStorageSync(key) ]
        )
      )
    );

    // 按照 uid、token 和 isStudent 来判断并设置登录状态
    this.globalData.isLogin = [ "uid", "token", "isStudent" ].every(
      key => !!this.globalData[key]
    );

    // globalData 设置完成
    console.log("全局数据 globalData:", this.globalData);

  },

  onShow() {}

})
