// activity/pages/activityDetails/activityDetails.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import onShareAppMessage from "../../../utils/onShareAppMessage";
import getHeader from "../../../utils/getHeader";

const app = getApp();
const requestUtils = require("../../../utils/requestUtils");
const activityApiUrl = `${app.globalData.apiUrl}/event`;
const header = getHeader("urlencoded", app.globalData.token);

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // showText: false,
    details: []
    
  },

  //获取活动详细页面
  getActivityDetails(evetnId){
    let data = {};
    let url = activityApiUrl + `/${evetnId}`;
    let getData = requestUtils.doGET(url, data, header);
    getData.then((res) => {
      console.log("开始请求");
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
  onLoad: function (options) {
    console.log(options.eventId);
    // this.getActivityDetails(options.eventId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击分享
   */
  onShareAppMessage: function () {

  },

  //滚动事件
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