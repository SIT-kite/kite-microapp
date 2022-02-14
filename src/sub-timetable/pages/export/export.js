// timetable/pages/export/export.js

import request from "../../../js/request";
import getHeader from "../../../js/getHeader";
import { checkObject } from "../../../js/type";

const app = getApp();
const { apiUrl, token } = app.globalData;

const reminderTimes = [
  { time:  0, text: "不提醒" },
  { time: 10, text: "提前 10 分钟" },
  { time: 15, text: "提前 15 分钟" },
  { time: 20, text: "提前 20 分钟" },
  { time: 30, text: "提前 30 分钟" }
];

Page({

  data: {
    reminder: { times: reminderTimes, index: 0 },
    showUrlTextarea: false,
    url: "请稍等"
  },

  onLoad() {
    this.setUrl();
  },

  getTime() {
    const { times, index } = this.data.reminder;
    return times[index].time;
  },

  setTime(e) {
    console.log(e.detail);
    this.setData({ "reminder.index": e.detail.value });
    this.setUrl();
  },

  setUrl() {

    const errorModel = content => wx.showModal({ title: "错误", content, showCancel: false });

    const calendar = wx.getStorageSync("timetableCalendar");
    if (calendar === "") {
      errorModel("无法获取课表学年学期！");
    } else if ( !checkObject(calendar, { year: "String", semester: "Number" }) ) {
      errorModel("课表学年学期对象错误，请联系开发者！");
    } else {

      const { year, semester } = calendar;
      const alarm = this.getTime() * 60;

      request({
        url: `${apiUrl}/edu/timetable/ics`,
        header: getHeader("urlencoded", token),
        data: { year, semester, alarm }
      }).then(
        res => this.setData({ url: res.data.data.url })
      );

    }

  },

  toggleUrlTextarea() {
    this.setData({showUrlTextarea: !this.data.showUrlTextarea});
  },

  copy() {
    const url = this.data.url;
    url === "请稍等"
    ? wx.showToast({ title: "请等待订阅地址生成完毕", icon: "none" })
    : wx.setClipboardData({ data: url }); // 会弹出 toast 提示"内容已复制"
  },

  // onReady () {},
  // onShow () {},
  // onHide () {},
  // onUnload () {},
  // onPullDownRefresh () {},
  // onReachBottom () {},
  // onShareAppMessage () {},
});
