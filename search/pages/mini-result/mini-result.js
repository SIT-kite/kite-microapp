// pages/mini-result/mini-result.js

import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
// const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKeyWord: "",
    miniResultList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

    this.setData({ searchKeyWord: wx.getStorageSync("searchKeyWord") })
    // console.log(this.data.searchKeyWord)
    const results = wx.getStorageSync("searchResultList");
    if (results) {
      this.setData({miniResultList: results.slice(0,2)});
    }
    // console.log(typeof(this.data.miniResultList[0].title))

  },

  // onReady() {},
  // onShow() {},

  // onPullDownRefresh() {},
  // onReachBottom() {},

  goDetails(event) {
    // console.log(event.currentTarget.id)
    wx.setStorageSync("searchResultItemIndex", event.currentTarget.id);
    wx.navigateTo({ url: "../details/details", })
  },

  /* goAll() {
    wx.navigateTo({ url: "../all/all" })
  }, */

  handlerGohomeClick,
  handlerGobackClick,
  onShareAppMessage: () => ({
    title: "用上应小风筝，便捷搜索全校通知公告",
    path: "pages/index/index"
  })

})
