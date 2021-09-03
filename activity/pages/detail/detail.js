// activity/pages/activityDetails/activityDetails.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import onShareAppMessage from "../../../utils/onShareAppMessage";
import getHeader from "../../../utils/getHeader";
import request from "../../../utils/request";

const app = getApp();
const activityApiUrl = `${app.globalData.apiUrl}/event`;
const header = getHeader("urlencoded", app.globalData.token);

Page({

  data: {
    // showText: false,
    details: []

  },

  // 获取活动详细页面
  getActivityDetails(eventId){
    request({
      url: `${activityApiUrl}/${eventId}`,
      header
    }).then((res) => {
      console.log("GET event", res.data.data);
    }).catch(() => {
      console.log("请求失败");
    })
  },

  handlerGohomeClick,
  handlerGobackClick,
  onShareAppMessage,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.eventId);
    // this.getActivityDetails(options.eventId);
  },

  // 生命周期函数--监听页面初次渲染完成
  // onReady() {},

  // 生命周期函数--监听页面隐藏
  // onHide() {},

  // 生命周期函数--监听页面卸载
  // onUnload() {},

  // 页面相关事件处理函数--监听用户下拉动作
  // onPullDownRefresh() {},

  // 页面上拉触底事件的处理函数
  // onReachBottom() {},

  // 滚动事件
  // onPageScroll: function(e) {
  //   let query = wx.createSelectorQuery()
  //       query.select('#title').boundingClientRect( (rect) => {
  //           let bottom = rect.bottom
  //           if (bottom + 300 <= e.scrollTop) {
  //               this.setData({
  //                   showText: true
  //               })
  //           } else {
  //               this.setData({
  //                 showText: false
  //               })
  //           }
  //       }).exec()
  // }
})
