// 我
// pages/person/person.js
import getHeader from "../../utils/getHeader";
import promisifyNoArg from "../../utils/promisify.noArg";
import request from "../../utils/request";

const app = getApp();

Page({

  data: {
    isLogin: app.globalData.isLogin,
    isStudent: app.globalData.isStudent
  },

  login() {
  // https://github.com/SIT-Yiban/kite-server/blob/master/docs/APIv1/用户模块.md

    const apiUrl = app.globalData.commonUrl;

    const hasErrorMsg = err =>
      "codeNotZero" in err &&
      err.codeNotZero === request.symbols.codeNotZero &&
      typeof err.res.msg === "string";

    const errorHandler = (error, prefix, msg) => {
      console.error(`${prefix} ${msg}`, error);
      wx.showModal({
        title: msg,
        content: `登录渠道创建失败，请检查网络或稍后再试。${
          hasErrorMsg(error) ? "\n错误信息：" + error.res.msg : ""
        }`,
        showCancel: false
      });
    }

    const setData = (data, to) => {
      to[0] && this.setData(data);
      to[1] && Object.assign(app.globalData, data);
      to[2] && Object.entries(data).forEach(
        ([key, value]) => wx.setStorageSync(key, value)
      );
    };

    // 设置本地变量 token 和 uid
    const setTokenAndUid = (token, uid) => setData({ token, uid }, [ 0, 1, 1 ]);

    // 从服务器端 GET user identity 并设置本地变量 isStudent
    const setIsStudent = () => {

      const set = isStudent => setData({ isStudent }, [ 1, 1, 1 ]);

      // GET user identity
      wx.request({
        method: "GET",
        url: `${apiUrl}/user/${app.globalData.uid}/identity`,
        header: getHeader("urlencoded", app.globalData.token),
        success: () => set(true),
        fail: error => {
          set(false);
          console.error("GET user identity 失败", error);
        }
      });

    }

    const setIsLogin = isLogin => setData({ isLogin }, [1, 1, 0]);

    promisifyNoArg(wx.login)().then(res => {

      const wxCode = res.code;
      wx.showLoading({ title: "加载中" });

      // POST session 登录
      request({
        url: `${apiUrl}/session`,
        method: "POST",
        header: getHeader("urlencoded"),
        data: { loginType: 0, wxCode }
      }).then(res => {

        console.log("POST session 登录成功", res);
        const data = res.data.data;
        setTokenAndUid(data.token, data.data.uid);
        setIsStudent();
        setIsLogin(true);
        wx.hideLoading();

      }).catch(error => {

        console.log("POST session 登录失败", error);

        // getUserProfile 获取微信用户信息
        wx.getUserProfile({
          lang: "zh_CN",
          desc: "上应小风筝需要获得您的公开信息（昵称、头像、地区及性别）"
        }).then(res => {

          const wxUserInfo = res.userInfo;
          console.log("用户信息 userinfo:", wxUserInfo);

          // POST user 创建用户
          request({
            url: `${apiUrl}/user`,
            method: "POST",
            header: getHeader("urlencoded"),
            data: wxUserInfo
          }).then(res => {

            console.log("POST user 用户创建成功", res);
            const data = res.data;
            setTokenAndUid(data.token, data.uid);
            setIsLogin(true);

            // POST user auth 创建登录渠道
            wx.request({
              url: `${apiUrl}/user/${app.globalData.uid}/authentication`,
              method: "POST",
              header: getHeader("urlencoded", app.globalData.token),
              data: { loginType: 0, wxCode },
              complete: () => wx.hideLoading(),
              success(res) {
                console.log("POST user auth 登录渠道创建成功", res);
              },
              fail(error) {
                errorHandler(error, "POST user auth", "登录渠道创建失败");
              }
            });

          }).catch(error => {
            wx.hideLoading();
            errorHandler(error, "POST user", "用户创建失败");
          });

        });

      });

    }).catch(
      error => {
        console.error("微信登录失败", error);
        wx.showModal({
          title: "微信登录失败",
          content: "微信登录失败，请检查网络或稍后重试。",
          showCancel: false
        });
      }
    );

  },
/*
  // 更新用户数据
  updateUserInfo: () => wx.getUserProfile({
    lang: "zh_CN",
    desc: "上应小风筝需要获得您的公开信息（昵称、头像、地区及性别）"
  }).then(
    res => wx.request({
      method: "PUT",
      url: `${gData.commonUrl}/user/${gData.uid}`,
      header: getHeader("urlencoded", gData.token),
      data: res.userInfo
    });
  )
*/
  onLoad() {},

  onReady() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({selected: 1}); // 选中第二个项目 "我"
    }
  },

  // onShow() {},

  onShareAppMessage: () => ({
    title: "上应小风筝",
    path: "pages/index/index"
  })

})
