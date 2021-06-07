// pages/freshman/navigate/navigate.js
import { handlerGohomeClick, handlerGobackClick } from "../../../../utils/navBarUtils";

Page({

  data: {},

  handlerGohomeClick,
  handlerGobackClick,

  onLoad: function () {},

  onReady: function () {
    wx.showLoading({ title: "正在加载" });
    setTimeout(() => wx.hideLoading(), 1500);
  },

  onShow: function () {},

})
