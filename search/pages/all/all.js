// pages/all/all.js
import {
  handlerGohomeClick,
  handlerGobackClick
} from '../../../utils/navBarUtils';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKeyWord:"",
    resultList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({searchKeyWord: wx.getStorageSync('searchKeyWord')})
    if(wx.getStorageSync('searchResultList')){
      this.setData({resultList: wx.getStorageSync('searchResultList')})
    }
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

  },
  goDetails: function(event) {
    // console.log(event.currentTarget.id)
    wx.setStorageSync('searchResultItemIndex', event.currentTarget.id);
    wx.navigateTo({
      url: '../details/details',
    })
  },
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick
})