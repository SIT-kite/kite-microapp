// timetable/pages/derivate/derivate.js

// import date from "../../../carpool/components/calendar/common/async-validator/validator/date";
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import request from "../../../utils/request";
import getHeader from "../../../utils/getHeader";
import { checkObject } from "../../../utils/type";

const app = getApp();

Page({

  data: {
    reminder_times: ["不提醒", 10, 15, 20, 30],
    choosed_time: "不提醒",
    url: "请稍等"
  },

  // 导航栏函数
  handlerGohomeClick,
  handlerGobackClick,

  onLoad() {
    this.setUrl();
  },

  setTime(e) {
    this.setData({ choosed_time: e.currentTarget.dataset.time });
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
      const time = this.data.choosed_time;
      const alarm = time === "不提醒" ? 0 : time * 60;
      request({
        url: `${app.globalData.apiUrl}/edu/timetable/ics`,
        header: getHeader("urlencoded", app.globalData.token),
        data: { year, semester, alarm }
      }).then(
        res => this.setData({ url: res.data.data.url })
      );

    }

  },

  copy(e) {
    const data = e.currentTarget.dataset.url;
    data === "请稍等"
    ? wx.showToast({ title: "请等待订阅地址生成完毕", icon: "none" })
    : wx.setClipboardData({ data }); // 会弹出 toast 提示"内容已复制"
  },

  // onReady () {},
  // onShow () {},
  // onHide () {},
  // onUnload () {},
  // onPullDownRefresh () {},
  // onReachBottom () {},
  // onShareAppMessage () {},
});
