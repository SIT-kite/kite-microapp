// timetable/pages/derivate/derivate.js
// import date from "../../../carpool/components/calendar/common/async-validator/validator/date";
import {
  handlerGohomeClick,
  handlerGobackClick,
} from "../../../utils/navBarUtils";
import getHeader from "../../../utils/getHeader";

let data = "请稍等";
let instructions =
  "该页面生成课表的订阅地址。在上方的“课前提醒”中，你可以设置课前提醒的时间差。将对应的同步地址复制到剪切板后，你可以使用浏览器下载并导入日历文件到手机自带的日历软件中，或直接将该同步地址复制到日历软件（如小米日历）里。";
let time = ["不提醒", 10, 15, 20, 30];
let choosed_time = "不提醒";
let calendar;

const app = getApp();
const requestUtils = require("../../../utils/requestUtils");
const urlSuffix = "/edu/timetable/ics";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    data,
    instructions,
    time,
    choosed_time,
    calendar,
  },
  // 导航栏函数
  handlerGohomeClick,
  handlerGobackClick,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setUrl();
  },
  setUrl() {
    let _this = this;
    let header = getHeader("urlencoded", app.globalData.token);
    _this.data.calendar = wx.getStorageSync("timetableCalendar");
    _this.setData(calendar);
    let data;
    let year = _this.data.calendar.year;
    let semester = _this.data.calendar.semester;
    let time;
    _this.data.choosed_time == "不提醒"
      ? (time = 0)
      : (time = _this.data.choosed_time);
    console.log(time);
    time = time * 60;
    let url = `${app.globalData.commonUrl}${urlSuffix}?year=${year}&semester=${semester}&alarm=${time}`;
    let seturl = requestUtils.doGET(url, data, header);
    seturl.then((res) => {
      data = res.data.data.url;
      _this.setData({
        data: data,
      });
    });
  },
  copy(e) {
    let url = e.currentTarget.dataset.url;
    console.log(url);
    wx.setClipboardData({ data: url });
  },
  settime(e) {
    const date = e.currentTarget.dataset.time;
    this.setData({ choosed_time: date });
    this.setUrl();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
