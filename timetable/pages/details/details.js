// timetable/pages/details/details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCourse: '高等数学',
    showTime: '12:34',
    showTutor: '魏彪',
    showLocation: '二教',


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    var courseId = options.courseId;
    // console.log(courseId);

    this.setData({
      showCourse:this.data.showCourse,
      showTime:this.data.showTime,
      showTutor:this.data.showTutor
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady (options) {


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage () {

  }
})
