// freshman/pages/stuInfoDetail/stuInfoDetail.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import getHeader from "../../../utils/getHeader";
import onShareAppMessage from "../../js/onShareAppMessage";

var app = getApp();
const requestUtils = require('../../../utils/requestUtils');


Page({
  data: {
    show: false,
    motto: 'Hey!',
    userDetail: null,
    avatarUrl: "",
    nickName: "",
  },

  handlerGohomeClick,
  handlerGobackClick,
  onShareAppMessage,

  /**
   * 页面数据重新加载
   */
  pageDataInit() {
    wx.showLoading({ title: "正在加载…", mask: true });

    const gData = app.globalData;
    // 获取新生信息
    const url = `${gData.apiUrl}/freshman/${gData.userInfo.account}`;
    const data = { "secret": gData.userInfo.secret };
    const header = getHeader("urlencoded", gData.token);
    requestUtils.doGET(url, data, header).then(res => {

      // 更新全局变量
      app.globalData.userDetail = res.data.data;
      wx.setStorageSync("userDetail", res.data.data);
      this.setData({
        userDetail: gData.userDetail,
        avatarUrl: gData.avatarUrl,
        nickName: gData.nickName
      });

    }).catch(error => {

      console.error("新生信息获取失败", error);
      wx.setStorage({ key: "userDetail", data: null });
      app.globalData.userDetail = null;
      wx.redirectTo({ url: "/freshman/pages/welcome/welcome" });

    }).then(() => {

      wx.hideLoading();
      console.log("数据处理完成");
      this.setData({ show: true });

    }).catch(res => {

      wx.hideLoading();
      wx.showModal({
        title: "哎呀，出错误了 >.<",
        content: (
          res.error === requestUtils.REQUEST_ERROR ? "业务逻辑错误"
          : res.error === requestUtils.NETWORK_ERROR ? "网络不在状态"
          : "未知错误"
        ),
        showCancel: false
      });

    });

  },

  unavaliableNotice: () => wx.showModal({
    title: "暂不可用",
    content: "报道指南更新中，暂不可用，敬请谅解~",
    confirmText: "知道了",
    showCancel: false
  }),

  onLoad() {
    this.setData({ show: false });
    console.log('页面 stuInfoDetail onLoad...');
  },

  onShow() {
    const {
      navBarHeight,
      navBarExtendHeight,
    } = getApp().globalSystemInfo;
    this.setData({
      navBarCurrentHeight: navBarExtendHeight + navBarHeight
    })
    console.log("页面 stuInfoDetail onShow...");
    this.pageDataInit();
  },

  // onReady() {},

})
