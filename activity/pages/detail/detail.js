// activity/pages/activityDetails/activityDetails.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
const app = getApp();


const request = require("../../utils/request");
const CATEGORY = ['主题报告', '社会实践', '创新创业创意', '校园安全文明', '公益志愿', '校园文化', '主题教育', '易班 、社区', '安全网络教育', '论文专利', '会议']


Page({

  data: {
    // showText: false,
    detail: null,
    src: '',
    CATEGORY,
    shared: false,
    timesOfShow: 0
  },

  //解析字段-持续时间
  handleDuration(duration) {
    duration = duration.replace(/ /g, "")
    if(duration.replace(/分钟/, "").includes("分钟")) {
      duration = duration.replace(/分钟/, "")
    }else {
      if (duration.replace(/分钟/, "").search(/\D/g) !== -1)
        duration = duration.replace(/分钟/, "")
    }
    return duration
  },

  // 获取活动详细页面
  getActivityDetails(eventId){
    request.fetchData(request.constructUrl('EVENT_DETAIL', {eventId: eventId}), 'EVENT_DETAIL', res => {
      let detail = res
      detail.startTime = detail.startTime.replace(/-/g, "/")
      detail.startTime = detail.startTime.replace(/T/g, "/")
      detail.startTime = detail.startTime.replace(/:\d\d[+]08:00/g, "")
      detail.duration = this.handleDuration(detail.duration)
      console.log(detail.description.search(/src=\"/))
      detail.description = detail.description.replace(/src=\"/," style=\"height:100%;width:100%;\" src=\"")
      // detail.startTime = new Date(detail.startTime)
      // detail.endTime = new Date(detail.startTime)
      // detail.endTime.setMinutes(detail.startTime.getMinutes() + detail.duration)
      this.setData({detail: detail})
      this.setData({src: `../../assets/pic/category/${detail.category}.png`})
    })
  },

  join() {
    app.globalData.isLogin
      ? app.globalData.verified
        ? request.submitData(request.constructUrl('EVENT_JOIN',{eventId:this.data.detail.activityId,force:false}),'EVENT_JOIN', res => {
          console.log(res.data)
            wx.showModal({
              title:'提示',
              content: res.data.result,
              showCancel: false
            })
        })
        : wx.showModal({
          title:'提示',
          content: '只有认证后才能报名哦!',
          showCancel: false,
          success: wx.navigateTo({url: '/pages/verify/verify'})
        })
    : wx.showModal({
      title:'提示',
      content: '请前往小程序登录和认证',
      showCancel: false
    })
  },

  handlerGohomeClick,
  handlerGobackClick,

  onShareAppMessage () {
    return {
      title: this.data.detail.title,
      path: `/activity/pages/detail/detail?eventId=${this.data.detail.activityId}&shared=true`,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getActivityDetails(options.eventId);
    if(options.shared === 'true') this.setData({shared: true});
  },

  onShow() {
    this.setData({timesOfShow: this.data.timesOfShow + 1})
    if(this.data.shared === true && this.data.timesOfShow > 1) {wx.switchTab({
      url: '/pages/index/index',
    })}
  }

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
