// pages/all/all.js

import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";

Page({

  data: {
    searchKeyWord: "",
    resultList: []
  },

  onLoad() {
    this.setData({searchKeyWord: wx.getStorageSync("searchKeyWord")})
    const results = wx.getStorageSync("searchResultList");
    if (results) {
      this.setData( {miniResultList: results });
    }
  },

  goDetails(event) {
    // console.log(event.currentTarget.id)
    wx.setStorageSync("searchResultItemIndex", event.currentTarget.id);
    wx.navigateTo({ url: "../details/details" })
  },

  // onReady() {},
  // onShow() {},

  // onPullDownRefresh() {},
  // onReachBottom() {},

  handlerGohomeClick,
  handlerGobackClick,

  onShareAppMessage: () => ({
    title: "用上应小风筝，便捷搜索全校通知公告",
    path: "pages/index/index"
  })
})
