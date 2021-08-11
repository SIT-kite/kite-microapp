// freshman/navigate/navigate.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";

Page({

  data: {},

  handlerGohomeClick,
  handlerGobackClick,

  // onLoad() {},

  onReady() {
    wx.showLoading({ title: "正在加载" });
    setTimeout(() => wx.hideLoading(), 500);
  },

  // onShow() {},

})
