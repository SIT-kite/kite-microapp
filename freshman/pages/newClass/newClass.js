// pages/newClass/newClass.js
import {
  handlerGohomeClick,
  handlerGobackClick
} from "../../../utils/navBarUtils";
import copyText from "../../../utils/copyText";
import catchError from "../../../utils/requestUtils.catchError";

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
    let url = `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}/classmate`;
    let data = {
      "secret": `${app.globalData.userInfo.secret}`
    };
    let header = {
      "content-type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${app.globalData.token}`,
    };

    let  response = await requestUtils.doGET(url, data, header);
    let  responsedData = response.data;
    let  classmateList = responsedData.data.classmates;

    return classmateList;
  },

  /**
   * 请求班级同学信息并更新页面. 请求出错时弹出错误提示.
   */
  async _getClassmates() {
    try {
      // 直接返回接口更新的列表
      return await this._requestClassmateList();
    }
    catch(error) {
      // 请求出现网络错误, 弹窗提示
      wx.showModal({
        title: "哎呀，出错误了 >.<",
        content: (
          res.error == requestUtils.REQUEST_ERROR ? res.data
          : res.error == requestUtils.NETWORK_ERROR ? "网络不在状态"
          : "未知错误"
        ),
        showCancel: false
      });
    }
  },

  /**
   * 页面数据刷新
   */
  async onPullDownRefresh () {
    // 加载数据
    this.setData({
      classmates: await this._getClassmates()
    });
    // 关闭刷新动画
    wx.stopPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad () {
    console.log("页面 newClass onLoad...");
    
    // 显示加载提示框
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    // 加载并设置数据
    this.setData({
      classmates: await this._getClassmates()
    });
    // 取消加载提示框
    wx.hideLoading();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "在上应小风筝开启大学生活第一站！",
      path: "/freshman/pages/welcome"
    }
  }
})
