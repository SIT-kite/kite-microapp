// freshman/pages/newClass/newClass.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import copyText from "../../../utils/copyText";
// import catchError from "../../../utils/requestUtils.catchError";
import getHeader from "../../../utils/getHeader";
import request from "../../../utils/request";
import onShareAppMessage from "../../js/onShareAppMessage";

const utlls = "../../../utils/";
const requestUtils = require(utlls + "requestUtils");

const app = getApp();

// 请求班级同学信息并更新页面，请求出错时弹出错误提示

Page({

  data: {
    loaded: false,
    classmates: [],
  },

  handlerGohomeClick,
  handlerGobackClick,
  onShareAppMessage,
  copyText,

  async setClassmates() {

    const gData = app.globalData;
    await request({

      method: "GET",
      url: `${gData.apiUrl}/freshman/${gData.userInfo.account}/classmate`,
      header: getHeader("urlencoded", gData.token),
      data: { "secret": gData.userInfo.secret }
    }).then(
      res => this.setData({
        classmates: res.data.data.classmates
      })
    ).catch(
      res => {
        console.error("班级同学获取错误", res)
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
    );

  },

  async onPullDownRefresh() {

    await this.setClassmates();
    wx.stopPullDownRefresh();

  },

  async onLoad() {

    wx.showLoading({ title: "正在加载…", mask: true });
    await this.setClassmates();
    this.setData({ loaded: true });
    wx.hideLoading();

  }

});
