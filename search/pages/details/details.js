// pages/details/details.js

import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentItemDetails:{
      author: "",
      content: "",
      publish_time: "",
      title: "",
      url: ""
    }
  },

  onLoad() {
    this.setData({
      currentItemDetails: wx.getStorageSync("searchResultList")[
        wx.getStorageSync("searchResultItemIndex")
      ]
    })
    // console.log(this.data.currentItemDetails)
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