// 我
// pages/person/person.js
const app = getApp();
const commonUrl = app.globalData.commonUrl;
const requestUtils = require('../../utils/requestUtils');
const promisify = require('../../utils/promisifyUtils');
const wxLogin = promisify(wx.login);
var wxCode = "";

const setUserData = (t, data) => t.setData({
  nickName: data.nickName,
  avater: data.userAvatar,
  isLogin: data.isLogin,
  isStudent: data.isStudent
});
const setTokenUid = (token, uid) => {
  app.globalData.token = token;
  app.globalData.uid = uid;
  wx.setStorageSync("token", token);
  wx.setStorageSync("uid", uid);
};

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

  /**
   * 返回获取用户实名认证请求的Promise
   * @return {Promise}
   */
  getIdentityPromise: () => {
    const url = `${commonUrl}/user/${app.globalData.uid}/identity`;
    const data = {};
    const header = {
      "content-type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${app.globalData.token}`
    };
    return requestUtils.doGET(url, data, header);
  },

  /**
   * 返回Post Session请求的Promise
   * @return {Promise}
   */
  postSessionPromise: () => {
    const url = `${commonUrl}/session`;
    const header = { "content-type": "application/x-www-form-urlencoded" };
    const data = {
      loginType: 0,
      wxCode
    };
    return requestUtils.doPOST(url, data, header);
  },

  /**
   * 返回PostUser请求的Promise
   * @param {Object} wxUserInfo 微信提供的用户信息
   * @return {Promise}
   */
  postUserPromise(wxUserInfo) {
    console.log('postUserPromise 调用注册逻辑');
    const url = `${commonUrl}/user`;
    const header = { "content-type": "application/x-www-form-urlencoded" };
    const data = wxUserInfo;
    return requestUtils.doPOST(url, data, header);
  },

  /**
   * 返回PostAuthentication请求的Promise
   * @return {Promise}
   */
  postUserAuthPromise: () => {
    const url = `${commonUrl}/user/${app.globalData.uid}/authentication`;
    const data = {
      loginType: 0,
      wxCode
    };
    const header = {
      "content-type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${app.globalData.token}`
    };
    return requestUtils.doPOST(url, data, header);
  },

  go_signup: function () {
    wx.navigateTo({
      url: '/pages/signup/signup'
    })
  },

  login: function (e) {

    const setIsStudent = isStudent => {
      this.setData({ isStudent });
      app.globalData.isStudent = isStudent;
      wx.setStorageSync("isStudent", isStudent);
    };

    var wxUserInfo = e.detail.userInfo;

    if (e.detail.userInfo) {
      wxLogin().then(res => {
        if (res.code) {
          wxCode = res.code;
          wx.showLoading({ title: '加载中' });
          return this.postSessionPromise();
        } else {
          return Promise.reject(`微信登录失败: ${res.errMsg}`)
        }
      }).then(res => {

        console.log("PostSession 成功", res);

        const data = res.data.data;

        // 设置本地变量 token uid
        setTokenUid(data.token, data.data.uid);

        // 设置本地变量 isStudent
        this.getIdentityPromise().then(
          () => setIsStudent(true)
        ).catch(
          () => setIsStudent(false)
        );
        wx.hideLoading();

      }).catch(res => {

        console.log("PostSession 失败 创建用户", res);

        const hideAndCatch = msg => (
          res => {
            wx.hideLoading();
            console.error(msg, res);
          }
        );

        // 创建用户
        this.postUserPromise(wxUserInfo).then(res => {

          const data = res.data.data;
          setTokenUid(data.token, data.data.uid);

          wxLogin().then(res => {

            // 更新全局 wxCode
            wxCode = res.code;

            this.postUserAuthPromise().then(() => {
              // PostAuthentication 成功

              // 设置本地变量 isStudent
              this.getIdentityPromise().then(
                () => setIsStudent(true)
              ).catch(
                () => setIsStudent(false)
              );
              wx.hideLoading();

            }).catch( hideAndCatch("PostAuthentication 失败") );
          }).catch( hideAndCatch("微信登录失败") );
        }).catch( hideAndCatch("创建用户失败") );




      });

      // 设置全局 Avatar nickName isLogin
      app.globalData.nickName = e.detail.userInfo.nickName;
      app.globalData.userAvatar = e.detail.userInfo.avatarUrl;
      app.globalData.isLogin = true;
      this.setData({
        nickName: app.globalData.nickName,
        avatar: app.globalData.userAvatar,
        isLogin: app.globalData.isLogin
      });

    }
  },
  moveToAbout() {
    wx.navigateTo({
      url: '/pages/about/about',
      success: () => console.log("跳转至 关于我们 页面")
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    setUserData(this, app.globalData);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    /*
    setUserData(this, app.globalData);
    */
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({selected: 1});
    }
    setUserData(this, app.globalData);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    return {
      title: "上应小风筝",
      path: "pages/index/index"
    }
  }
})
