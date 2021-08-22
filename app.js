// app.js

import updateManager from "./utils/updateManager";
import { isNonEmptyString } from "./utils/type";
import { getAllStorageAsObject } from "./utils/storage";
import getHeader from "./utils/getHeader";

App({

  globalData: {

    apiUrl: "https://kite.sunnysab.cn/api/v1",
    commonUrl: "https://kite.sunnysab.cn/api/v1",

    isDev: false, // 是否在微信开发者工具中

    uid: -1,   // 用户 ID
    token: "", // 登录需要的授权码

    isLogin:  false, // 是否已登录
    verified: false, // 是否已实名

    nickName:  null, // 昵称
    avatarUrl: null, // 头像

    signPrivacyConfirm:     false, // 实名隐私协议
    freshmanPrivacyConfirm: false, // 迎新隐私协议

    visible: false, // 迎新 inputInfo 页面 复选框 同城可见
    userInfo: {},   // 迎新 inputInfo 页面 验证信息 姓名/考生号/准考证号，身份证后六位
    contact: {},    // 迎新 inputInfo 页面 联系方式 手机号 tel，qq，微信 wechat

    userDetail: null, // {} 迎新 stuInfoDetail 页面 用户详情
    classmates: null, // [] 迎新      newClass 页面 同班同学
    roommates:  null, // [] 迎新     newFriend 页面 我的室友
    familiar:   null, // [] 迎新     newFriend 页面 可能认识的人

    searchResultList: [],
    searchHistoryList: [],
    searchKeyWord: "",
    searchResultItemIndex: 0,

  },

  onLaunch() {

    updateManager();

    const gData      = this.globalData;
    const storage    = getAllStorageAsObject();
    const systemInfo = wx.getSystemInfoSync();

    // 从本地存储 Storage 中获取重要属性，设置全局数据 globalData
    [ "uid", "token", "verified",
      "nickName", "avatarUrl", "userInfo", "userDetail",
      "signPrivacyConfirm", "freshmanPrivacyConfirm" ]
    .filter(  key => key in storage )
    .forEach( key => gData[key] = storage[key] );

    // 将 isStudent 属性更新为 verified
    // 这段代码到 2022 年的时候大概就可以移除了
    if ("isStudent" in storage) {
      gData.verified = storage.isStudent;
      wx.setStorageSync("verified", gData.verified);
      wx.removeStorageSync("isStudent");
    }

    // 按照 uid 和 token 来判断并设置 isLogin
    gData.isLogin = (
      gData.uid > 0 &&
      isNonEmptyString(gData.token)
    );

    // 如果用户已登录但昵称或头像缺失，则获取昵称和头像

    if (
      gData.isLogin && !(
        isNonEmptyString(gData.nickName) &&
        isNonEmptyString(gData.avatarUrl)
      )
    ) {
      console.warn("用户已登录，但昵称或头像缺失", {
        nickName: gData.nickName,
        avatarUrl: gData.avatarUrl
      });
      wx.request({
        url: `${gData.apiUrl}/user/${gData.uid}`,
        header: getHeader("urlencoded", gData.token),
        success: res => {
          const data = res.data.data;
          const nickName = data.nickName;
          const avatarUrl = data.avatar;
          Object.assign(gData, { nickName, avatarUrl });
          wx.setStorageSync("nickname", nickName);
          wx.setStorageSync("avatarUrl", avatarUrl);
        },
        fail: console.error
      });
    }

    // 设置 isDev，按照 isDev 打印调试信息
    gData.isDev = systemInfo.platform === "devtools";
    if (gData.isDev) {
      console.groupCollapsed("%c调试信息", "color: #0075E8");
      new Map([
        [ "全局数据 globalData" , gData ],
        [ "本地存储 Storage"    , storage ],
        [ "系统信息 SystemInfo" , systemInfo ]
      ]).forEach(
        (value, name) => console.log(`${name}:`, value)
      );
      console.groupEnd();
    }

  }

});
