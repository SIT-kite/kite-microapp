// timetable/pages/derivate/derivate.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";

let data = "uhdweifobvwphiowrwrldergbrtbrbrbrw"
let instructions= "基本上，它是一个带有.ics扩展名的文件，其中包括有关会议，组织者和与会者，日期，时间和持续时间，位置等的相关信息，所有这些格式都可以通过各种平台和日历服务识别。尽管iCalendar具有高级功能，但在会议计划者最低可行产品（MVP）的现阶段，我想确保可以将我们安排的会议轻松导入到Google日历，Apple日历和Microsoft Outlook中，并可以通过Web邮件服务识别。 稍后我将扩展其功能。通过早期的教程，我构建了收集所有必要信息（例如参与者，日期，时间和位置）的功能。 现在，我只需要在附件中发布事件详细信息并通过电子邮件发送即可。"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data,instructions
  },
  // 导航栏函数
  handlerGohomeClick,
  handlerGobackClick,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  copy(e) {
    let url = e.currentTarget.dataset.url
    wx.setClipboardData({ data: url })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})