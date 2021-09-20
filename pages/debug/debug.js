// pages/debug/debug.js

import onShareAppMessage from "../../utils/onShareAppMessage";
import { getAllStorageAsObject } from "../../utils/storage";
import request   from "../../utils/request";
import getHeader from "../../utils/getHeader";
import copyText  from "../../utils/copyText";
import loading   from "../../utils/loading";

const app = getApp();
const gData = app.globalData;

const loginModal = () => wx.showModal({
  title: "尚未登录",
  content: "您尚未登录，请先返回并登录。",
  showCancel: false
});

Page({

  data: {
    error: "",
    globalData: "尚未获取",
    storage: "尚未获取",
    systemInfo: "尚未获取"
  },

  onShareAppMessage,

  catchError(msg, res, err) {
    this.setData({
      error:
        JSON.stringify(res) + "\n\n" +
        JSON.stringify(err)
    });
    console.error(msg, {res, err});
    wx.showModal({
      title: msg,
      content: `${msg}，已在页面上方显示错误信息。`,
      showCancel: false
    })
  },

  getUserInfo() {
    gData.isLogin
    ? request({
      url: `${gData.apiUrl}/user/${gData.uid}`,
      header: getHeader("urlencoded", gData.token)
    }).then(
      res => {
        const data = res.data.data;
        const nickName = data.nickName;
        const avatarUrl = data.avatar;
        Object.assign(gData, { nickName, avatarUrl });
        wx.setStorageSync("nickname", nickName);
        wx.setStorageSync("avatarUrl", avatarUrl);
        wx.showToast({ title: "获取成功" });
      },
    ).catch(
      err => this.catchError("用户信息获取失败", {}, err)
    ) : loginModal();
  },

  updateUserInfo() {
    gData.isLogin
    ? wx.getUserProfile({
      lang: "zh_CN",
      desc: "上应小风筝需要获得您的公开信息"
    }).then(
      res => {
        const { nickName, avatarUrl } = res.userInfo;
        Object.assign(gData, { nickName, avatarUrl });
        wx.setStorageSync("nickname", nickName);
        wx.setStorageSync("avatarUrl", avatarUrl);
        request({
          method: "PUT",
          url: `${gData.apiUrl}/user/${gData.uid}`,
          header: getHeader("urlencoded", gData.token),
          data: res.userInfo
        }).then(
          () => wx.showToast({ title: "更新成功" })
        ).catch(
          err => this.catchError("用户信息更新失败", res.userInfo, err)
        )
      }
    ) : loginModal();
  },

  clearStorage(e) {

    const clearStorageAndToast = title => wx.clearStorage({
      success: () => wx.showToast({ title })
    });

    wx.showModal(
      ({
        some: {
          title: "是否清理本地数据",
          content: "确定要清理本地数据吗？",
          success(res) {
            if (res.confirm) {
              const keyMap = new Map(
                [ "uid", "token", "verified", "userInfo" ].map(
                  key => [ key, wx.getStorageSync(key) ]
                )
              );
              clearStorageAndToast("已清理本地数据");
              keyMap.forEach(
                (data, key) => wx.setStorageSync(key, data)
              );
            }
          }
        },
        all: {
          title: "是否清空本地数据",
          content: "清空后，再次进入小程序时需要重新登录。确定要清空吗？",
          success: res => {
            if (res.confirm) {
              gData.isLogin = false;
              clearStorageAndToast("已清空本地数据");
            }
          }
        }
      })[e.target.dataset.clear]
    );

  },

  setDebugInfo() {
    loading({
      title: "正在获取…",
      callback: async () => {

        const has = (array, value) => array.some(item => item === value);

        const is = {
          api: (key, value) => (
            has([ "apiUrl", "commonUrl" ], key) || (
              typeof value === "string" &&
              value.includes("kite.sunnysab.cn")
            )
          ),
          token: (key, value) => (
            key === "token" &&
            value !== ""
          ),
          userInfo: (key, value) => (
            has([ "userInfo", "contact" ], key) &&
            JSON.stringify(value) !== "{}"
          ),
          userDetail: (key, value) => (
            key === "userDetail" &&
            value !== null
          ),
          timetable: (key, value) => (
            key === "timetable_schedule" &&
            value !== null
          )
        };

        // TODO：分成多个不同函数，进一步按需使用，比如无论如何都隐藏 timetable_schedule
        const removeToken =
          gData.isDev
          ? null
          : (key, value) => (
            is.api(key, value)
            ? undefined
            : is.token(key, value) ||
              is.userInfo(key, value) ||
              is.userDetail(key, value)
              ? "[已隐藏]"
              : is.timetable(key, value)
              ? "[长度过长，已隐藏]"
              : value
          );

        const stringify = (data, replacer = null) => JSON.stringify(data, replacer, 2);

        this.setData({
          globalData: stringify(gData, removeToken),
          storage:    stringify(getAllStorageAsObject(), removeToken),
          systemInfo: stringify(wx.getSystemInfoSync())
        });

      }
    });
  },

  copy(e) {
    copyText(this.data[e.target.dataset.name]);
  },

  // onLoad() {},
  // onReady() {},
  // onShow() {}

})
