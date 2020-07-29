// pages/qrcode/qrcode.js
import drawQrcode from 'weapp-qrcode'
const app = getApp()
const url = app.globalData.commonUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stuInfo: {
      realName: " ",
      studentId: " ",
      college: " ",
    },
    isStu: false,
    getInfo: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
    this.setData({
      isStu:app.globalData.isStudent
    })
    const that = this;
    wx.request({
      url: `${url}/checking/${app.globalData.uid}`,
      method: 'GET',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${app.globalData.token}`
      },
      success: function (res) {
        if (res.data.code === 1003) {
          that.setData({
            isStu:false
          })
          console.log(that.data.isStu)
        } else if (res.data.code === 1001) {
          that.setData({
            getInfo: false
          })
        }
      }
    })
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'myQrcode',
      text: `${JSON.stringify(that.data.stuInfo)}`,
      foreground: "#008000"
    })
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