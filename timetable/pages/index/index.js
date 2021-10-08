import {
  handlerGohomeClick,
  handlerGobackClick,
} from "../../../utils/navBarUtils";
import getHeader from "../../../utils/getHeader";

const app = getApp();
const timeTableSuffix = "/edu/timetable";
const calendarSuffix = "/edu/calendar";
const scheduleSuffix = "/edu/schedule";
const urlCalendar = `${app.globalData.commonUrl}${calendarSuffix}`;
const urlSchedule = `${app.globalData.commonUrl}${scheduleSuffix}`;
const header = getHeader("urlencoded", app.globalData.token);
const requestUtils = require("../../../utils/requestUtils");
const timeUtils = require("../../../utils/timeUtils");
const transformationsUtils = require("../../../utils/transformationsUtils");
const discipline = require("./discipline");
// const QR = require("../../../utils/weapp-qrcode")

let weekDate = [];
let days = [];
let page = 0;
let page_day = 0;
let timetableMode = 1;
let courseDay = [];
let courseWeek = [];
let tapSet = false;
let choosedCouple = false;
let thisWeek = 0;
let startWeek;
let choosedDay = [];
let toSchool;
let calendar = [];
let code = false;
let qrcodeWidth = 150;
let codeText = "dwdwefewfw";
let table = [];
let list = [];
let refresh = true;
let request = false;
let isShow_detail = false;
let detail = [{ courseName: "defe", place: "efef" }];
Page({
  data: {
    weekDate,
    days,
    timetableMode,
    list,
    tapSet,
    page,
    thisWeek,
    startWeek,
    courseDay,
    choosedDay,
    discipline,
    page_day,
    toSchool,
    code,
    qrcodeWidth,
    codeText,
    choosedCouple,
    table,
    courseWeek,
    calendar,
    request,
    isShow_detail,
    detail,
    refresh,
  },
  // 导航栏函数
  handlerGohomeClick,
  handlerGobackClick,

  // 发送请求
  SendData() {
    let _this = this;
    wx.showLoading({
      // 加载动画
      title: "加载中",
      mask: true,
    });
    _this.setSchedule();
    _this.setCalendar();
  },
  // 请求作息表
  setSchedule() {
    let dataSchedule = {};
    let schedule = requestUtils.doGET(urlSchedule, dataSchedule, header); // 作息表请求
    schedule
      .then((res) => {
        dataSchedule = res.data.data;
        this.setData({ table: dataSchedule });
        wx.setStorageSync("timetableSchedule", dataSchedule);
      })
      .catch((err) => {
        this.getError(err);
      });
  },
  // 请求开学时间
  setCalendar() {
    let _this = this;
    let dataCalendar = {};
    let calendar = requestUtils.doGET(urlCalendar, dataCalendar, header); // 请求开学时间
    calendar
      .then((res) => {
        dataCalendar = res.data.data;
        dataCalendar.start = dataCalendar.start.replace(/-/g, "/"); // 解决ios时间问题
        _this.setData({
          calendar: dataCalendar,
          toSchool: dataCalendar.start,
        });
        let year = dataCalendar.year;
        let semester = dataCalendar.semester;
        let startTime =
          Date.parse(new Date()) < Date.parse(dataCalendar.start)
            ? dataCalendar.start
            : new Date();
        _this.setTime(dataCalendar.start, startTime); // 加载时间函数
        _this.setTimetable(year, semester); // 请求课表
        wx.setStorageSync("timetableCalendar", dataCalendar);
      })
      .catch((err) => {
        _this.getError(err);
      });
  },
  // 请求课表函数
  setTimetable(year, semester) {
    let _this = this;
    let courseDay;
    let courseWeek;
    let dataTimetable = {};
    let urlTimetable = `${app.globalData.commonUrl}${timeTableSuffix}?year=${year}&semester=${semester}`;
    let timeTable = requestUtils.doGET(urlTimetable, dataTimetable, header);
    timeTable
      .then((res) => {
        dataTimetable = res.data.data.timeTable;
        _this.setData({
          list: dataTimetable,
        });
        let Data = _this.processData(
          _this.data.list,
          _this.data.thisWeek,
          _this.data.choosedDay
        );
        courseDay = Data[0]; // 日课表数据
        courseWeek = Data[1]; // 周课表数据
        _this.setData({ courseDay, courseWeek });
        wx.setStorageSync("timetableList", dataTimetable);
        wx.hideLoading();
      })
      .catch((err) => {
        _this.getError(err);
      });
  },
  // 报错处理方案
  getError(err) {
    wx.hideLoading();
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
  setTime(schoolHolidayDirectory, givenTime) {
    const _this = this;
    let startWeek = _this.data.startWeek;
    schoolHolidayDirectory = Date.parse(new Date(schoolHolidayDirectory));
    givenTime = Date.parse(new Date(givenTime));
    let thisWeek = _this.distanceFromSchoolWeek(
      schoolHolidayDirectory,
      givenTime
    );
    if (startWeek == undefined) {
      startWeek = thisWeek;
    }
    let weekDate = timeUtils.getTimeOfWeek(givenTime);
    weekDate.map((el) => {
      el = _this.addWeeks(el, el.week);
    });
    let nowDate = _this.assignChoosedDay(givenTime);
    _this.setData({
      date: weekDate,
      days: _this.data.days,
      choosedDay: { week: nowDate },
      thisWeek: thisWeek,
      startWeek: startWeek,
    });
  },
  // 计算所给日期与开学的周数差
  distanceFromSchoolWeek(schoolHolidayDirectory, givenTime) {
    let thisWeek = timeUtils.getIntervalToCurrentWeek(
      schoolHolidayDirectory,
      givenTime
    );
    return thisWeek;
  },
  // 添加星期
  addWeeks(date, week) {
    switch (week) {
      case 0:
        date.weekday = "日";
        date.week = 7;
        break;
      case 1:
        date.weekday = "一";
        break;
      case 2:
        date.weekday = "二";
        break;
      case 3:
        date.weekday = "三";
        break;
      case 4:
        date.weekday = "四";
        break;
      case 5:
        date.weekday = "五";
        break;
      case 6:
        date.weekday = "六";
        break;
    }
    return date;
  },
  // 对选择日期处理
  assignChoosedDay(givenTime) {
    let nowDate = new Date(givenTime);
    console.log();
    this.data.choosedDay.week !== undefined
      ? (nowDate =
          this.data.choosedDay.week == 0 ? 7 : this.data.choosedDay.week)
      : (nowDate = nowDate.getDay() != 0 ? nowDate.getDay() : 7);
    return nowDate;
  },
  // 转换课时时间
  tableTime(e) {
    let y = 0;
    for (var j = 0; j < e.length; j++) {
      for (var i = 0; i < e[j].table.length; i++) {
        if (e[j].table[i] === 1 && y == 0) {
          e[j].table_time = [];
          e[j].table_time[0] = i + 1;
          y = 1;
        } else if (e[j].table[i] === 0 && y == 1) {
          e[j].table_time[1] = i;
          y = 0;
        }
      }
    }
    return e;
  },
  // 刷新函数
  refresh() {
    this.data.refresh
      ? wx.showModal({
          showCancel: false,
          content:
            "一般情况下，小风筝课表会在一定天数后自动刷新。您也可以手动点击这个按钮，以将数据同步到最新。",
          complete: () => {
            this.SendData();
            this.data.refresh = false;
            wx.setStorageSync("timetableRefresh", this.data.refresh);
          },
        })
      : this.SendData();
  },
  // 时间改变函数
  changeTime(startTime, givenTime) {
    let _this = this;
    let nowTime = _this.TermBegins();
    let startWeek = _this.data.startWeek;
    _this.data.thisWeek = givenTime;
    let time = Date.parse(nowTime) + (givenTime - startWeek) * 604800000;
    time = new Date(time);
    _this.setTime(startTime, time);
    _this.setData(thisWeek);
  },
  // 读取缓存
  readData() {
    let _this = this;
    _this.data.list = wx.getStorageSync("timetableList");
    _this.data.table = wx.getStorageSync("timetableSchedule");
    _this.data.calendar = wx.getStorageSync("timetableCalendar");
    _this.data.toSchool = _this.data.calendar.start;
    _this.data.refresh = wx.getStorageSync("timetableRefresh");
    _this.data.refresh.length == 0
      ? (_this.data.refresh = true)
      : (_this.data.refresh = wx.getStorageSync("timetableRefresh"));
    if (wx.getStorageSync("timetableMode") == 0) {
      wx.setStorageSync("timetableMode", 1);
    }
    _this.data.timetableMode = wx.getStorageSync("timetableMode");
  },
  // 时间判断（是否开学）
  TermBegins() {
    let _this = this;
    let time = 0;
    Date.parse(new Date()) < Date.parse(_this.data.toSchool) // 是否开学
      ? (time = _this.data.toSchool)
      : (time = new Date());
    return time;
  },

  // 判断是否有数据
  isEmptyValue() {
    let _this = this;
    console.log(
      _this.data.list.length !== 0 &&
        _this.data.calendar.length !== 0 &&
        _this.data.table.length !== 0
    );
    return (
      _this.data.list.length !== 0 &&
      _this.data.calendar.length !== 0 &&
      _this.data.table.length !== 0
    );
  },
  // 是否接收数据判断
  receiveData(time) {
    let _this = this;
    let courseDay, courseWeek;
    if (_this.isEmptyValue()) {
      // 判断是否有请求数据
      _this.setTime(_this.data.toSchool, time);
      // console.log(_this.data.list);
      let Data = _this.processData(
        _this.data.list,
        _this.data.thisWeek,
        _this.data.choosedDay
      );
      courseDay = Data[0]; // 日课表数据
      courseWeek = Data[1]; // 周课表数据
    } else {
      _this.SendData(); // 请求数据
    }
    let list = [courseDay, courseWeek];
    return list;
  },
  // 渲染开始
  onLoad(options) {
    let _this = this;
    _this.animation = wx.createAnimation({
      // 设置动画初始设置
      duration: 300,
      timingFunction: "ease",
    });
    let courseDay, time, courseWeek;
    _this.readData();
    time = _this.TermBegins();
    // console.log(time);
    let data = _this.receiveData(time);
    courseDay = data[0];
    courseWeek = data[1];
    // console.log(_this.processData(time));
    _this.setData({
      list: _this.data.list,
      courseDay: courseDay,
      table: _this.data.table,
      toSchool: _this.data.toSchool,
      courseWeek: courseWeek,
      timetableMode: _this.data.timetableMode,
      refresh: _this.data.refresh,
    });
  },

  // 课表数据处理
  processData(list, thisWeek, day) {
    let weekList = [];
    let dayList = [];
    // console.log(list);
    list = this.binary(list);
    weekList = list.filter((el) => el.weeks[thisWeek - 1] == "1"); // 筛出对应周的数据
    weekList = this.processWeek(weekList);
    dayList = weekList.filter((el) => el.day == day.week); // 筛出对应日期的数据
    dayList = this.processDay(dayList);
    let data = [dayList, weekList];
    return data;
  },
  // 日课表数据处理
  processDay(dayList) {
    dayList.sort((a, b) => a.time_index - b.time_index); // 对课程进行排序
    dayList = this.Label(dayList);
    dayList = this.table(dayList);
    return dayList;
  },
  // 对课程贴入标签
  Label(dayList) {
    let discipline = this.data.discipline.discipline;
    dayList.map((el) => {
      discipline[el.courseName] != undefined
        ? (el.discipline = discipline[el.courseName])
        : (el.discipline = "generality");
    });
    return dayList;
  },
  // 插入作息表
  table(e) {
    let _this = this;
    let table = _this.data.table;
    let y = 0;
    for (var j = 0; j < e.length; j++) {
      for (var i = 0; i < e[j].table.length; i++) {
        if (e[j].table[i] === 1 && y === 0) {
          e[j].tables = [];
          table[e[j].campus][e[j].place.substring(0, 2)] !== undefined
            ? (e[j].tables[0] =
                table[e[j].campus][e[j].place.substring(0, 2)][i][0])
            : (e[j].tables[0] = table[e[j].campus]["default"][i][0]);
          y = 1;
        } else if (e[j].table[i] === 0 && y == 1) {
          table[e[j].campus][e[j].place.substring(0, 2)] != undefined
            ? (e[j].tables[1] =
                table[e[j].campus][e[j].place.substring(0, 2)][i - 1][1])
            : (e[j].tables[1] = table[e[j].campus]["default"][i - 1][1]);
          y = 0;
        }
      }
    }
    return e;
  },
  // 周课表数据处理
  processWeek(weekList) {
    for (let i = 0; i < weekList.length; i++) {
      let section = 0;
      let time = 0;
      for (let x = 0; x < weekList[i].table.length; x++) {
        if (weekList[i].table[x] == 1 && time == 0) {
          section = x + 1;
          time++;
        } else if (weekList[i].table[x] == 1) {
          time++;
        }
        let color = i % 9; // 选取颜色
        weekList[i].colorArrays = color;
        weekList[i].section = section;
        weekList[i].time = time;
        weekList[i] = this.courseRepeat(i, weekList[i], weekList);
      }
    }
    // todo: 暂时不知道是否需要删除
    // list.map((el) => {
    //   //对多余数据进行删除
    //   delete el.weeks;
    //   delete el.table;
    // });
    return weekList;
  },
  courseRepeat(x, weekList, list) {
    for (let i = 0; i < list.length; i++) {
      weekList.day == list[i].day &&
      weekList.section == list[i].section &&
      i != x
        ? (weekList.repeat = true)
        : "";
    }
    weekList.repeat == undefined ? (weekList.repeat = false) : "";
    return weekList;
  },
  // 部分二进制数据转换
  binary(list) {
    // console.log(list);
    if (list.length === 0) {
      // 防止t.map的出现
      return 0;
    } else {
      list.map((el) => {
        el.weeks = transformationsUtils.transformations(el.week, 32);
        el.table = transformationsUtils.transformations(el.timeIndex, 32);
      });
    }
    return list;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // onReady: function () {
  //   var imgData = QR.drawImg(this.data.codeText, {
  //     typeNumber: 4,
  //     errorCorrectLevel: 'M',
  //     size: 500
  //   })
  //   this.setData({
  //     QRCode: imgData
  //   })
  // },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},

  // 敲击日按钮
  tapDays(e) {
    let _this = this;
    let date = e.currentTarget.dataset.days.week;
    _this.data.choosedDay.week = date;
    _this.setData({ choosedDay: { week: date } });
    let courseDay = _this.processData(
      _this.data.list,
      _this.data.thisWeek,
      _this.data.choosedDay
    )[0];
    _this.setData({ courseDay });
    // console.log(_this.selectComponent('#the-id'))
  },
  // 敲击周日切换按钮
  tapActivity(e) {
    let _this = this;
    let timetableMode = _this.data.timetableMode;
    timetableMode == 1 ? (timetableMode = 2) : (timetableMode = 1);
    _this.setData({ timetableMode: timetableMode });
    wx.setStorage({
      key: "timetableMode",
      data: timetableMode,
    });
  },
  // 敲击设置按钮（暂未使用）
  tapSet(e) {
    let _this = this;
    let tapSet = _this.data.tapSet;
    tapSet = !tapSet;
    _this.setData({ tapSet });
  },
  // 周数设置按钮函数
  sliderChange(e) {
    let _this = this;
    let sliderChange = e.detail.value;
    _this.changeTime(_this.data.toSchool, sliderChange);
    let courseDay = _this.processData(
      _this.data.list,
      _this.data.thisWeek,
      _this.data.choosedDay
    )[0];
    let courseWeek = _this.processData(
      _this.data.list,
      _this.data.thisWeek,
      _this.data.choosedDay
    )[1];
    _this.setData({ courseDay, courseWeek });
  },
  // 滑动换算函数
  conversionPage(index, page, data) {
    switch (index) {
      case 1:
        page == 0 ? data++ : data--;
        break;
      case 2:
        page == 1 ? data++ : data--;
        break;
      case 0:
        page == 2 ? data++ : data--;
        break;
    }
    return data;
  },
  // 时间滑动函数
  bindChangeWeek(e) {
    let index = e.detail.current;
    let _this = this;
    let page = _this.data.page;
    let thisWeek = _this.data.thisWeek;
    thisWeek = _this.conversionPage(index, page, thisWeek);
    page = index;
    if (thisWeek <= 0) {
      // 第一周到底
      thisWeek = 1;
    }
    _this.changeTime(_this.data.toSchool, thisWeek);
    let data = _this.processData(
      _this.data.list,
      _this.data.thisWeek,
      _this.data.choosedDay
    );
    let courseDay = data[0];
    let courseWeek = data[1];
    _this.setData({
      courseDay,
      courseWeek,
      navState: index,
      page,
      thisWeek,
    });
  },

  bindChangeDay(e) {
    let index = e.detail.current;
    let _this = this;
    let page_day = _this.data.page_day;
    let this_day = _this.data.choosedDay.week;
    this_day = _this.conversionPage(index, page_day, this_day);
    page_day = index;
    _this.data.choosedDay.week = this_day;
    switch (_this.data.choosedDay.week) {
      case 8:
        _this.data.choosedDay.week = 1;
        _this.data.thisWeek++;
        _this.changeTime(_this.data.toSchool, _this.data.thisWeek);
        break;
      case 0:
        _this.data.thisWeek--;
        _this.data.thisWeek == 0 ? (_this.data.thisWeek = 1) : ""; // 第一周到底
        _this.changeTime(_this.data.toSchool, _this.data.thisWeek);
        break;
    }
    let courseDay = _this.processData(
      _this.data.list,
      _this.data.thisWeek,
      _this.data.choosedDay
    )[0];
    this.setData({
      navState_day: index,
      page_day,
      choosedDay: _this.data.choosedDay,
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
    this.data.choosedCouple = !this.data.choosedCouple;
    this.setData(choosedCouple);
  },
  collapse() {
    if (this.data.tapSet === true) {
      this.setData({ tapSet: false });
    }
  },
  collapse_detail() {
    if (this.data.isShow_detail === true) {
      this.setData({ isShow_detail: false });
      this.animation.translate(0, 360).step("ease");
      this.setData({ animation: this.animation.export() });
    }
  },
  getDetail(e) {
    let _this = this;
    let nameList = [e.detail];
    let detail = [];
    let courseWeek = _this.data.courseWeek;
    console.log(courseWeek.length);
    for (let i = 0; i < courseWeek.length; i++) {
      nameList[0].day == courseWeek[i].day &&
      nameList[0].section == courseWeek[i].section &&
      nameList[0].courseName != courseWeek[i].courseName
        ? nameList.push(courseWeek[i])
        : "";
    }
    for (let j = 0; j < nameList.length; j++) {
      let data = _this.getName(nameList[j]);
      detail.push(data);
    }
    // 动画判断
    this.detailAnimation(detail);
    _this.data.isShow_detail = !_this.data.isShow_detail;
    _this.setData({ detail: detail, isShow_detail: _this.data.isShow_detail });
  },
  getName(e) {
    let _this = this;
    let name = e.courseName;
    let nameList = _this.data.list.filter((el) => el.courseName == name);
    // 获取相应的课程时间
    nameList = _this.tableTime(nameList);
    // 获取相应的上课时间
    nameList = _this.processDetail(nameList);
    // 内容整合去重
    let detail = _this.duplicateRemoval(nameList);
    return detail;
  },
  // 获取相应的上课时间
  processDetail(nameList) {
    let _this = this;
    for (let i = 0; i < nameList.length; i++) {
      nameList[i].table_time =
        nameList[i].table_time[0] + "~" + nameList[i].table_time[1] + "节"; // 上课时间
      nameList[i] = _this.addWeeks(nameList[i], nameList[i].day);
      let section = 0;
      let time = 0;
      for (let x = 0; x < nameList[i].weeks.length; x++) {
        if (nameList[i].weeks[x] == 1 && time == 0) {
          section = x + 1;
          time++;
        } else if (nameList[i].weeks[x] == 1) {
          time++;
        }
      }
      time = time + section - 1;
      time == section
        ? (nameList[i].weeksday =
            section +
            "周 · 周" +
            nameList[i].weekday +
            "(" +
            nameList[i].table_time +
            ")")
        : (nameList[i].weeksday =
            section +
            "-" +
            time +
            "周 · 周" +
            nameList[i].weekday +
            "(" +
            nameList[i].table_time +
            ")");
      nameList[i].time = time;
    }
    return nameList;
  },
  // 详情页动画判断
  detailAnimation(e) {
    let _this = this;
    let hight = e.length == 1 ? 450 : 500;
    console.log(e.length);
    if (!_this.data.isShow_detail) {
      _this.animation.translate(0, -hight).step();
      _this.setData({ animation: _this.animation.export() });
    } else {
      _this.animation.translate(0, hight).step();
      _this.setData({ animation: _this.animation.export() });
    }
  },
  // 去重合并
  duplicateRemoval(nameList) {
    let courseName = [],
      teacher = [],
      place = [],
      weeksday = [],
      dynClassId = [],
      courseId = [];
    nameList.map((el) => {
      courseName.indexOf(el.courseName) === -1
        ? courseName.push(el.courseName)
        : "";
      teacher.indexOf(el.teacher) === -1 ? teacher.push(el.teacher) : "";
      weeksday.indexOf(el.weeksday) === -1 ? weeksday.push(el.weeksday) : "";
      place.indexOf(el.place) === -1 ? place.push(el.place) : "";
    });
    courseId = nameList[0].courseId;
    dynClassId = nameList[0].dynClassId;
    let result = { courseName, teacher, weeksday, place, courseId, dynClassId };
    return result;
  },
});
