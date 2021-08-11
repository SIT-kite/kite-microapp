// freshman/pages/newClass/newClass.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import copyText from "../../../utils/copyText";
// import catchError from "../../../utils/requestUtils.catchError";
import getHeader from "../../../utils/getHeader";

const utlls = "../../../utils/";
const requestUtils = require(utlls + "requestUtils");

const app = getApp();

Page({

  data: {
    classmates: [],
  },

  handlerGohomeClick,
  handlerGobackClick,
  copyText,

  /**
   * 请求班级同学信息
   */
  async _requestClassmateList() {
    const gData = app.globalData;

    let url = `${gData.commonUrl}/freshman/${gData.userInfo.account}/classmate`;
    let data = { "secret": gData.userInfo.secret };
    let header = getHeader("urlencoded", gData.token);

    let response = await requestUtils.doGET(url, data, header);

    return response.data.data.classmates;
  },

  // 请求班级同学信息并更新页面. 请求出错时弹出错误提示.
  async _getClassmates() {
    try {
      // 直接返回接口更新的列表
      return await this._requestClassmateList();
    } catch(res) {
      console.error("班级同学获取错误", res)
      // 请求出现网络错误, 弹窗提示
      wx.showModal({
        title: "哎呀，出错误了 >.<",
        content: (
          res.error === requestUtils.REQUEST_ERROR ? res.data
          : res.error === requestUtils.NETWORK_ERROR ? "网络不在状态"
          : "未知错误"
        ),
        showCancel: false
      });
    }
  },

  async onPullDownRefresh() {

    this.setData({
      classmates: await this._getClassmates()
    });
    wx.stopPullDownRefresh();

  },

  async onLoad() {

    wx.showLoading({
      title: '加载中',
      mask: true
    });
    this.setData({
      classmates: await this._getClassmates()
    });
    wx.hideLoading();

  },

  onShareAppMessage: () => ({
    title: "在上应小风筝开启大学生活第一站！",
    path: "/freshman/pages/welcome"
  })

});
