//TODO 完成：主体框架设计、完成时间、周数 未完成：日课表块、数据请求、数据处理、数据缓存、课程icon
import {
  handlerGohomeClick,
  handlerGobackClick
} from '../../../utils/navBarUtils';
import getHeader from "../../../utils/getHeader";

const app = getApp();
const availableSuffix = `/contact`;
const requestUtils = require("../../../utils/requestUtils");
const timeUtils = require("../../../utils/timeUtils");
const transformationsUtils = require("../../../utils/transformationsUtils");
const discipline = require('./discipline')

let date = []
let days = []
let page = 0
let page_day = 0
let chooseActivity = 1
let course_data = []
let tapSet = false
let this_week = 0
let startWeek = 0
let choosedday = []
let toschool = '2021-6-5'
let code = false
let list = [
  {
    course_name: "机械原理",
    day : 1,
    time_index : 3,
    weeks : 2097151,
    place : "A102",
    teacher : "张建国",
    campus : "一教",
    credit : 3,
    hours : 64,
    dyn_class_id : 2000235,
    course_id : 2222
  },
  {
    course_name: "多元统计分析",
    day : 2,
    time_index : 3,
    weeks : 2097151,
    place : "A102",
    teacher : "张建国",
    campus : "二教",
    credit : 3,
    hours : 64,
    dyn_class_id : 2000235,
    course_id : 2222
  },
  {
    course_name: "体育4篮球（女）",
    day : 1,
    time_index : 5,
    weeks : 2097151,
    place : "A102",
    teacher : "张建国",
    campus : "一教",
    credit : 3,
    hours : 64,
    dyn_class_id : 2000235,
    course_id : 2222
  },
  {
    course_name: "波谱分析",
    day : 1,
    time_index : 6,
    weeks : 2097151,
    place : "A102",
    teacher : "张建",
    campus : "三教",
    credit : 3,
    hours : 64,
    dyn_class_id : 2000235,
    course_id : 2222
  },
  {
    course_name: "食品试验设计与计算机统计分析",
    day : 1,
    time_index : 2,
    weeks : 2097151,
    place : "A102",
    teacher : ["张建国","晓同"],
    campus : "一科",
    credit : 3,
    hours : 64,
    dyn_class_id : 2000235,
    course_id : 2222
  },
  {
    course_name: "展示工程",
    day : 1,
    time_index : 2,
    weeks : 2097151,
    place : "A102",
    teacher : "张建国",
    campus : "工训馆",
    credit : 3,
    hours : 64,
    dyn_class_id : 2000235,
    course_id : 2222
  },
  {
    course_name: "生物燃料",
    day : 1,
    time_index : 2,
    weeks : 2097151,
    place : "A102",
    teacher : "张建国",
    campus : "一教",
    credit : 3,
    hours : 64,
    dyn_class_id : 2000235,
    course_id : 2222
  },
  {
    course_name: "园林工程预决算",
    day : 1,
    time_index : 2,
    weeks : 2097151,
    place : "A102",
    teacher : "张建国",
    campus : "奉贤校区",
    credit : 3,
    hours : 64,
    dyn_class_id : 2000235,
    course_id : 2222
  },]
let colorArrays = ["rgba(251,83,82,0.7)", "rgba(115,123,250,0.6)", "rgba(116, 185, 255,0.7)", "rgba(118,126,253,0.7)", "rgba(245,175,77,0.7)", "rgba(187,137,106,0.7", "rgba(232, 67, 147,0.7)", "rgba(188,140,240,0.7)", "rgba(116, 185, 255,0.7)"]
let wlist = [
  { "week_what": 1, "section_what": 1, "time": 3, "content": "高等数学一教A-302" },
  { "week_what": 1, "section_what": 5, "time": 3, "content": "大学物理一教A-301" },
  { "week_what": 2, "section_what": 1, "time": 2, "content": "初级通用学术英语一教A-301" },
  { "week_what": 2, "section_what": 8, "time": 2, "content": "计算机网络一教A-301" },
  { "week_what": 3, "section_what": 4, "time": 1, "content": "计算机组成原理一教A-301" },
  { "week_what": 3, "section_what": 8, "time": 1, "content": "高等数学一教A-301" },
  { "week_what": 3, "section_what": 5, "time": 2, "content": "线性代数一教A-301" },
  { "week_what": 4, "section_what": 2, "time": 3, "content": "巫术一教A-301" },
  { "week_what": 5, "section_what": 1, "time": 2, "content": "羽毛球一教A-301" },
  { "week_what": 6, "section_what": 3, "time": 2, "content": "三国杀一教A-301" },
  { "week_what": 7, "section_what": 5, "time": 3, "content": "高等数学一教A-301" },
]

Page({
  data: {
    date, days, chooseActivity, list, tapSet, page, this_week, startWeek, course_data, choosedday, discipline, page_day, toschool, code, wlist, colorArrays
  },
  //导航栏函数
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick,

  time: function (schoolholidaydirectory, giventime) {
    let _this = this
    let date = _this.data.date
    let this_week = timeUtils.getIntervalToCurrentWeek(schoolholidaydirectory, giventime);
    if (_this.data.startWeek == 0) { _this.data.startWeek = this_week }
    date = timeUtils.getTimeOfWeek(giventime);
    date.map(el => {
      if (el.week == 0) { el.weeks = '一'; return el; }
      else if (el.week == 1) { el.weeks = '二'; return el; }
      else if (el.week == 2) { el.weeks = '三'; return el; }
      else if (el.week == 3) { el.weeks = '四'; return el; }
      else if (el.week == 4) { el.weeks = '五'; return el; }
      else if (el.week == 5) { el.weeks = '六'; return el; }
      else if (el.week == 6) { el.weeks = '日'; return el; }
    })
    let nowdate = new Date();
    nowdate = nowdate.getDay();
    _this.data.choosedday.week = nowdate
    _this.setData({
      date: date,
      days: _this.data.days,
      choosedday: { week: nowdate },
      this_week: this_week,
      startWeek: _this.data.startWeek
    })
  },

  changeTime: function (starttime, giventime) {
    let _this = this
    let startWeek = _this.data.startWeek
    _this.data.this_week = giventime;
    let time = Date.parse(new Date()) + (giventime - startWeek) * 604800000
    time = new Date(time)
    _this.time(starttime, time);
  },

  onLoad: function (options) {
    let _this = this
    _this.time(_this.data.toschool, new Date());
    let course_data = _this.binary(_this.data.list, _this.data.this_week, _this.data.choosedday);
    _this.setData({ list: _this.data.list, course_data: course_data });
  },
  binary: function (list, this_week, day) {
    console.log(this_week, day.week)
    let discipline = this.data.discipline.discipline
    let newlist = []
    let textlist = []
    if (typeof list[1].weeks == 'number') {
      // console.log(typeof list[1].weeks)
      list.map(el => {
        el.weeks = transformationsUtils.transformations(el.weeks, 32)
      })
    }
    // console.log(typeof list[1].weeks)
    newlist = list.filter(el => el.weeks[this_week] == "1")
    textlist = newlist.filter(el => el.day == day.week)
    textlist.sort((a, b) => a.time_index - b.time_index)
    for (let i = 0; i < textlist.length; i++) {
      for (let j = 0; j < discipline.length; j++) {
        // console.log(textlist[i].course_name == discipline[j].discipline)
        if (textlist[i].course_name === discipline[j].subject) {
          console.log(discipline[j].discipline)
          textlist[i].discipline = discipline[j].discipline
        }
      }
      console.log(textlist)
    }
    return textlist
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  tapDays: function (e) {
    let _this = this;
    let date = e.currentTarget.dataset.days.week;
    this.data.choosedday.week = date
    this.setData({ choosedday: { week: date } })
    let course_data = _this.binary(_this.data.list, _this.data.this_week, _this.data.choosedday);
    _this.setData({ list: _this.data.list, course_data: course_data });
  },

  tapActivity: function (e) {
    let _this = this;
    let chooseActivity = _this.data.chooseActivity;
    if (chooseActivity == 1) {
      chooseActivity = 2;
      _this.setData({
        chooseActivity: chooseActivity
      })
    } else if (chooseActivity == 2) {
      chooseActivity = 1;
      _this.setData({
        chooseActivity: chooseActivity
      })
    }
  },
  tapSet: function (e) {
    let _this = this;
    let tapSet = _this.data.tapSet
    if (tapSet == false) {
      tapSet = true;
      _this.setData({ tapSet: tapSet });
    } else if (tapSet == true) {
      tapSet = false;
      _this.setData({ tapSet: tapSet });
    }
  },
  sliderchange: function (e) {
    let _this = this;
    let sliderChange = e.detail.value
    _this.changeTime(_this.data.toschool, sliderChange);
    let course_data = _this.binary(_this.data.list, _this.data.this_week, _this.data.choosedday);
    _this.setData({ list: _this.data.list, course_data: course_data });
  },
  bindchange(e) {
    let index = e.detail.current;
    let _this = this;
    let page = _this.data.page
    let this_week = _this.data.this_week
    if (index == 1) {
      if (page == 0) {
        page = index
        this_week = this_week + 1
        _this.setData({ this_week: this_week })
      } else if (page == 2) {
        page = index
        this_week = this_week - 1
        _this.setData({ this_week: this_week })
      }
    }
    if (index == 2) {
      if (page == 1) {
        page = index
        this_week = this_week + 1
        _this.setData({ this_week: this_week })
      } else if (page == 0) {
        page = index
        this_week = this_week - 1
        _this.setData({ this_week: this_week })
      }
    }
    if (index == 0) {
      if (page == 2) {
        page = index
        this_week = this_week + 1
        _this.setData({ this_week: this_week })
      } else if (page == 1) {
        page = index
        this_week = this_week - 1
        _this.setData({ this_week: this_week })
      }
    }
    _this.changeTime(_this.data.toschool, this_week)
    this.setData({
      navState: index,
      page: page
    })
    let course_data = _this.binary(_this.data.list, _this.data.this_week, _this.data.choosedday);
    _this.setData({ list: _this.data.list, course_data: course_data });
  },

  bindchangeday(e) {
    let index = e.detail.current;
    let _this = this;
    let page_day = _this.data.page_day;
    let this_day = _this.data.choosedday.week
    if (index == 1) {
      if (page_day == 0) {
        page_day = index
        this_day = this_day + 1
        _this.data.choosedday.week = this_day;
        _this.setData({ choosedday: _this.data.choosedday })
      } else if (page_day == 2) {
        // console.log(page_day)
        page_day = index
        this_day = this_day - 1
        // console.log(this_day)
        _this.data.choosedday.week = this_day;
        _this.setData({ choosedday: _this.data.choosedday })
      }
    }
    if (index == 2) {
      if (page_day == 1) {
        // console.log(page_day)
        page_day = index
        this_day = this_day + 1
        _this.data.choosedday.week = this_day;
        _this.setData({ choosedday: _this.data.choosedday })
      } else if (page_day == 0) {
        // console.log(page_day)
        page_day = index
        this_day = this_day - 1
        _this.data.choosedday.week = this_day;
        _this.setData({ choosedday: _this.data.choosedday })
      }
    }
    if (index == 0) {
      if (page_day == 2) {
        // console.log(page_day)
        page_day = index
        this_day = this_day + 1
        console.log(this_day)
        _this.data.choosedday.week = this_day;
        _this.setData({ choosedday: _this.data.choosedday })
      } else if (page_day == 1) {
        // console.log(page_day)
        page_day = index
        this_day = this_day - 1
        console.log(this_day)
        _this.data.choosedday.week = this_day;
        _this.setData({ choosedday: _this.data.choosedday })
      }
    }
    if (_this.data.choosedday.week == 7) {
      _this.data.choosedday.week = 0;
      _this.data.this_week++;
      _this.changeTime(_this.data.toschool, _this.data.this_week)
    }

    if (_this.data.choosedday.week == -1) {
      _this.data.choosedday.week = 0;
      _this.data.this_week--;
      _this.changeTime(_this.data.toschool, _this.data.this_week)
    }

    this.setData({
      navState_day: index,
      page_day: page_day
    })
    let course_data = _this.binary(_this.data.list, _this.data.this_week, _this.data.choosedday);
    _this.setData({ list: _this.data.list, course_data: course_data });
  },

  scanCode: function (e) {
    wx.scanCode({
      success(res) {
        console.log(res.result)
      }
    })
  },
  code: function (e) {

  }
})