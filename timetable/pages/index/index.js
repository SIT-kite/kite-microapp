import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import { check } from "../../../utils/type";
import request from "../../../utils/request";
import getHeader from "../../../utils/getHeader";
import discipline from "./discipline";
const timeUtils = require("../../../utils/timeUtils");
const transformationsUtils = require("../../../utils/transformationsUtils");
// const QR = require("../../../utils/weapp-qrcode")

const app = getApp();

const urlCalendar  = `${app.globalData.apiUrl}/edu/calendar`;
const urlSchedule  = `${app.globalData.apiUrl}/edu/schedule`;
const urlTimetable = `${app.globalData.apiUrl}/edu/timetable`;

const header = getHeader("urlencoded", app.globalData.token);

const checkCourseConflict = (x, course, courses) => {
  course.conflict = false;
  for (let i = 0; i < courses.length; i++) {
    if (
      i !== x &&
      course.day === courses[i].day &&
      course.section === courses[i].section
    ) {
      course.conflict = courses[i].conflict = true;
    }
  }
};

// let code = false;
// let qrcodeWidth = 150;
// let codeText = "dwdwefewfw";

Page({
  data: {
    date: [],
    timetableMode: "day", // 日课表："day"，周课表："week"
    tapSet: false, // 是否显示设置周数
    schedule: [], // 作息时间表 schedule
    calendar: [], //   开学时间 calendar
    timetable: [],     //     课程表 timetable
    page: 0,
    pageDay: 0,
    thisWeek: 0,
    startWeek: -1,
    courseDay: [],
    courseWeek: [],
    choosedDay: [],
    toSchool: "",
    showDetail: false,
    detail: [{ courseName: "", place: "" }],
    refresh: false,
    choosedCouple: false,
    // code,
    // qrcodeWidth,
    // codeText,
  },

  // 导航栏函数
  handlerGohomeClick,
  handlerGobackClick,

  onLoad() {
    this.animation = wx.createAnimation({ duration: 300, timingFunction: "ease" });
    this.readStorage();
    this.fetchDataOnDemand(this.TermBegins());
  },

  // onReady: function () {
  //   var imgData = QR.drawImg(this.data.codeText, {
  //     typeNumber: 4,
  //     errorCorrectLevel: 'M',
  //     size: 500
  //   })
  //   this.setData({ QRCode: imgData })
  // },

  // 读取缓存
  readStorage() {
    this.data.timetable = wx.getStorageSync("timetableList");
    this.data.schedule  = wx.getStorageSync("timetableSchedule");
    this.data.calendar  = wx.getStorageSync("timetableCalendar");
    this.data.toSchool = this.data.calendar.start;

    const refresh = wx.getStorageSync("timetableRefresh");
    this.data.refresh = check(refresh, "Boolean") ? true : refresh;

    const timetableMode = wx.getStorageSync("timetableMode");
    if (timetableMode === "day" || timetableMode === "week") {
      this.setData({timetableMode});
    } else {
      wx.setStorageSync("timetableMode", "day");
    }
  },

  // 时间判断（是否开学）
  TermBegins() {
    const toSchool = new Date(this.data.toSchool);
    return Date.now() < toSchool.getTime() ? toSchool : new Date();
  },

  // 按需判断是否接收数据
  fetchDataOnDemand(time) {
    let courseDay, courseWeek;
    if (
      ["timetable", "calendar", "schedule"].every(
        key => this.data[key].length !== 0
      )
    ) {
      // 判断是否有请求数据
      this.setTime(this.data.toSchool, time);
      let Data = this.processTimetable();
      [courseDay, courseWeek] = Data;
      this.setData({ courseDay, courseWeek });
    } else {
      this.fetchData(); // 请求数据
    }
  },

  // 发送请求
  fetchData() {
    wx.showLoading({ title: "加载中", mask: true });
    Promise.allSettled([
      this.fetchSchedule(), this.fetchCalendar().then(this.fetchTimetable)
    ]).finally( () => wx.hideLoading() );
  },

  // 请求作息表
  fetchSchedule() {
    return request({ url: urlSchedule, header }).then(res => {
      const dataSchedule = res.data.data;
      this.setData({ schedule: dataSchedule });
      wx.setStorageSync("timetableSchedule", dataSchedule);
    }).catch(this.getError);
  },

  // 请求开学时间；会返回开学时间，以便请求课表
  // calendar = { "year": "yyyy-yyyy", "semester": 1 或 2, "start": "yyyy-MM-dd" }
  fetchCalendar() {
    return request({ url: urlCalendar, header }).then(res => {
      const calendar = res.data.data;
      calendar.start = calendar.start.replace(/-/g, "/"); // 解决ios时间问题

      this.setData({ calendar, toSchool: calendar.start });
      wx.setStorageSync("timetableCalendar", calendar);

      let startTime =
        Date.parse(new Date()) < Date.parse(calendar.start)
          ? calendar.start
          : new Date();
      this.setTime(calendar.start, startTime); // 加载时间函数

      return calendar;

    }).catch(this.getError);
  },

  // 请求课表
  fetchTimetable(calendar) {
    const {year, semester} = calendar;
    return request({
      url: `${urlTimetable}?year=${year}&semester=${semester}`,
      header
    }).then(res => {
      const timetable = res.data.data.timeTable;
      this.setData({ timetable });
      wx.setStorageSync("timetableList", timetable);
      const [courseDay, courseWeek] = this.processTimetable();
      this.setData({ courseDay, courseWeek });
    }).catch(this.getError);
  },

  // 报错处理方案
  getError(err) {
    wx.showModal({
      title: "请及时联系工作人员",
      content:
        err.data.code !== 1
          ? err.data.msg
          : "业务逻辑出错,研究生暂不支持（＞人＜；）,认证密码可能更改",
      showCancel: false,
      complete:
        err.data.code === 6
          ? () => {
              app.globalData.identity = {};
              app.globalData.verified = false;
              wx.setStorageSync("verified", false);
              wx.setStorageSync("identity", {});
              wx.redirectTo({ url: "/pages/verify/verify" });
            }
          : () => {
              console.log("错误代码" + err.data.code);
              wx.navigateBack({ delta: 2 });
            },
    });
  },

  // 计算一周日期
  setTime(schoolHolidayDict, givenTime) {
    schoolHolidayDict = Date.parse(new Date(schoolHolidayDict));
    givenTime = Date.parse(new Date(givenTime));

    const date = timeUtils.getTimeOfWeek(givenTime).map(
      el => {
        el.weekday = "日一二三四五六"[el.week];
        if (el.week === 0) { el.week = 7; }
        return el;
      }
    );

    let week = new Date(givenTime);
    week = this.data.choosedDay.week !== undefined
      ? this.data.choosedDay.week === 0 ? 7 : this.data.choosedDay.week
      : week.getDay() !== 0 ? week.getDay() : 7;
    const choosedDay = { week };

    // 计算所给日期与开学的周数差
    const thisWeek = timeUtils.getIntervalToCurrentWeek(schoolHolidayDict, givenTime);

    let startWeek = this.data.startWeek;
    if (startWeek === -1) { startWeek = thisWeek; }

    this.setData({ date, choosedDay, thisWeek, startWeek });
  },

  // 转换课时时间
  tableTime(courses) {
    courses.forEach(
      course => course.table_time = ["indexOf", "lastIndexOf"].map(
        method => course.table[method](1) + 1
      )
    )
    return courses;
  },

  // 刷新函数
  refresh() {
    this.data.refresh
      ? wx.showModal({
          showCancel: false,
          content:
            "一般情况下，小风筝课表会在一定天数后自动刷新。" +
            "您也可以手动点击这个按钮，以将数据同步到最新。",
          complete: () => {
            this.fetchData();
            this.data.refresh = false;
            wx.setStorageSync("timetableRefresh", this.data.refresh);
          },
        })
      : this.fetchData();
  },

  // 课表数据处理
  processTimetable(timetable = this.data.timetable) {
    let weekList = [];
    let dayList = [];
    timetable.forEach(course => {
      course.weeks = transformationsUtils.transformations(course.week, 32);
      course.table = transformationsUtils.transformations(course.timeIndex, 32);
    });
    weekList = timetable.filter( // 筛出对应周的数据
      course => course.weeks[this.data.thisWeek - 1] === 1
    );
    this.processWeek(weekList);
    dayList = weekList.filter( // 筛出对应日期的数据
      course => course.day === this.data.choosedDay.week
    );
    this.processDay(dayList);
    return [dayList, weekList];
  },

  // 周课表数据处理
  processWeek(courses) {
    courses.forEach((course, i) => {
      const getRange = time => ["indexOf", "lastIndexOf"].map(
        method => time[method](1)
      );
      const [start, end] = getRange(course.table);
      course.color = i % 9; // 背景色
      course.section = start; // 开始时间
      course.time = end - start + 1; // 长度
      checkCourseConflict(i, course, courses);
    });
  },

  // 日课表数据处理
  processDay(courses) {
    // 排序
    courses.sort((a, b) => a.time_index - b.time_index);
    // 设置标签和上课时间
    courses.forEach(course => {

      // 标签
      course.discipline = discipline.get(course.courseName) ?? "generality";

      // 上课时间
      const table = [
        [ course.campus,           "奉贤校区" ], // 校区 奉贤校区没了以后记得改哦
        [ course.place.slice(0, 2), "default" ]  // 教学楼
      ].reduce(
        (table, [key, fallback]) => table[ key in table ? key : fallback ],
        this.data.schedule // 作息表
      );

      course.tables = ["indexOf", "lastIndexOf"].map(
        (method, index) => table[ course.table[method](1) ][index]
      );

    });
  },

  // 敲击日按钮
  tapDays(e) {
    const week = e.currentTarget.dataset.week;
    this.setData({
      choosedDay: { week }
    })
    this.setData({courseDay: this.processTimetable()[0]});
  },

  // 敲击周课表日课表切换按钮
  tapActivity() {
    const timetableMode = this.data.timetableMode === "day" ? "week" : "day";
    this.setData({ timetableMode });
    wx.setStorageSync("timetableMode", timetableMode);
  },
  // 敲击设置按钮（暂未使用）
  tapSet() {
    this.setData({ tapSet: !this.data.tapSet });
  },

  // 时间改变函数
  changeTime(startTime, givenTime) {
    let startWeek = this.data.startWeek;
    console.log("changeTime():", {startTime, givenTime, startWeek})
    this.setTime(startTime, new Date(
      this.TermBegins().getTime() + (givenTime - startWeek) * 604800000
    ));
    this.setData({thisWeek: givenTime});
  },

  // 周数设置按钮函数
  sliderChange(e) {
    let sliderChange = e.detail.value;
    this.changeTime(this.data.toSchool, sliderChange);
    let [courseDay, courseWeek] = this.processTimetable();
    this.setData({ courseDay, courseWeek });
  },
  // 滑动换算函数
  conversionPage(index, page, data) {
    switch (index) {
      case 1: return page === 0 ? data++ : data--;
      case 2: return page === 1 ? data++ : data--;
      case 0: return page === 2 ? data++ : data--;
    }
  },
  // 时间滑动函数
  bindChangeWeek(e) {
    let index = e.detail.current;
    let { page, thisWeek } = this.data;
    thisWeek = this.conversionPage(index, page, thisWeek);
    page = index;
    if (thisWeek <= 0) { thisWeek = 1; } // 第一周到底
    this.changeTime(this.data.toSchool, thisWeek);
    let [courseDay, courseWeek] = this.processTimetable();
    this.setData({ courseDay, courseWeek, page, thisWeek });
  },

  bindChangeDay(e) {

    let index = e.detail.current;
    let pageDay = this.data.pageDay;
    let thisDay = this.data.choosedDay.week;
    thisDay = this.conversionPage(index, pageDay, thisDay);
    pageDay = index;

    this.data.choosedDay.week = thisDay;
    switch (this.data.choosedDay.week) {
      case 8:
        this.data.choosedDay.week = 1;
        this.data.thisWeek++;
        this.changeTime(this.data.toSchool, this.data.thisWeek);
        break;
      case 0:
        this.data.thisWeek--;
        this.data.thisWeek === 0 ? (this.data.thisWeek = 1) : ""; // 第一周到底
        this.changeTime(this.data.toSchool, this.data.thisWeek);
        break;
    }

    let courseDay = this.processTimetable()[0];

    this.setData({
      pageDay,
      choosedDay: this.data.choosedDay,
      courseDay
    });

  },

  // 情侣课表扫码
  scanCode() {
    wx.scanCode({
      success(res) {
        console.log(res.result);
      },
    });
  },
  code() {
    this.setData({choosedCouple: !this.data.choosedCouple});
  },

  collapse() {
    if (this.data.tapSet === true) {
      this.setData({ tapSet: false });
    }
  },
  collapseDetail() {
    if (this.data.showDetail === true) {
      this.setData({ showDetail: false });
      this.animation.translate(0, 360).step("ease");
      this.setData({ animation: this.animation.export() });
    }
  },

  getDetail(e) {
    let courses = [e.detail];
    let detail = [];
    let courseWeek = this.data.courseWeek;
    courseWeek.filter(
      _ =>
        courses[0].day === _.day &&
        courses[0].section === _.section &&
        courses[0].courseName !== _.courseName
    ).forEach(
      _ => courses.push(_)
    );
    courses.forEach(
      course => detail.push(this.prepareDetailCourse(course))
    );
    // 动画判断
    let height = detail.length === 1 ? 450 : 500;
    this.animation.translate(0, this.data.showDetail ? height : -height).step();
    this.setData({
      animation: this.animation.export(),
      detail,
      showDetail: !this.data.showDetail
    });
  },

  prepareDetailCourse(e) {
    let courses = this.data.timetable.filter(el => el.courseName === e.courseName);
    courses.forEach(course => {
      // 设置上课周数、日期与时间
      const getRange = list => ["indexOf", "lastIndexOf"].map(
        method => list[method](1) + 1
      );
      course.table_time = getRange(course.table);
      const [start, end] = getRange(course.weeks);
      course.weeksday = `${start === end ? start : `${start}-${end}`}周` + // 周数
      " · " +
      `周${"日一二三四五六"[course.day]}` + // 周日期
      `(${course.table_time.join("~")}节)`; // 上课时间
      course.time = end;
    });
    // 内容整合去重
    return this.duplicateRemoval(courses);
  },

  // 去重合并
  duplicateRemoval(nameList) {
    const keys = ["courseName", "teacher", "place", "weeksday"];
    const result = {};
    keys.forEach( key => result[key] = new Set() );
    nameList.map( el => keys.forEach( key => result[key].add(el[key]) ) );
    keys.forEach( key => result[key] = Array.from(result[key]) );
    result.courseId = nameList[0].courseId;
    result.dynClassId = nameList[0].dynClassId;
    return result;
  },

  popUp() {
    wx.showModal({
      cancelColor: 'cancelColor',
      showCancel: false,
      content:'当前课表只使用小程序缓存数据，刷新功能已禁用'
    })
  },
  onPullDownRefresh() {},

  onShareAppMessage: () => ({
    title: "用上应小风筝，无广告零干扰查看本校课表！",
    path: "/pages/index/index"
  }),

});
