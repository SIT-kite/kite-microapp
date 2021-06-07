// pages/available-room/show.js
import {
  handlerGohomeClick,
  handlerGobackClick
} from '../../../utils/navBarUtils'
import {
  formatTime
} from "../../../utils/timeUtils.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollWidth: 0,
    scrollLeftWidth: 0,
    windowWidth: 0,
    dates: [],
    buildings: "ABCDEFGHI",
    currentDateIndex: 0,
    currentBuildIndex: 0,
    classRooms: [{
      name: "A101",
      remark: "备注",
      busy: [1, 2, 3, 4, 7, 8]
    }, {
      name: "A102",
      remark: "备注",
      busy: [1, 2, 5, 6, 9, 10, 11, 12]
    }]
  },

  //11111
  handleInput(e) {
    //console.log(e.detail.value);
    this.setData({
      num: e.detail.value
    })

  },

  getScrollWidth: function () {
    var scrollWidth = wx.getSystemInfoSync().windowWidth;
    this.setData({
      scrollWidth: scrollWidth / 5 * 6,
      windowWidth: scrollWidth
    })
  },

  scrollleft: function (e) {
    console.log(e);
  },
  lowerRight: function (e) {
    console.log(e);
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    that.getScrollWidth();
    this._initDate();
  },
  changeDate(e){
    //选择日期
    const currentDateIndex = e.currentTarget.dataset.index
    const selectedDate = this.data.dates[currentDateIndex]
    //TODO:ajax请求选择日期的数据

    this.setData({
      currentDateIndex
    })
  },
  changeBuilding(e){
    const currentBuildIndex = e.currentTarget.dataset.index
    this.setData({
      currentBuildIndex
    })

  },
  _initDate() {
    const dates = ['今天']
    const date = new Date()
    for (let i = 0; i < 6; i++) {
      const currentTime = formatTime(date)
      dates.push(currentTime)
    }
    this.setData({
      dates
    })
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