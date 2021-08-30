//TODO 设置页弹出动画、情侣课表页面、TODO、五天|七天、支持使用教务系统的密码、支持直接导入班级课表、用户未实名，跳转到实名认证页。
import {
  handlerGohomeClick,
  handlerGobackClick
} from '../../../utils/navBarUtils';
import getHeader from "../../../utils/getHeader";

const app = getApp();
const timeTableSuffix = "/edu/timetable";
const requestUtils = require("../../../utils/requestUtils");
const timeUtils = require("../../../utils/timeUtils");
const transformationsUtils = require("../../../utils/transformationsUtils");
const discipline = require('./discipline')
// const QR = require("../../../utils/weapp-qrcode")

let date = []
let days = []
let page = 0
let page_day = 0
let timetableMode = 1
let course_data = []
let tapSet = false
let choosedCouple= false
let this_week = 0
let startWeek = 0
let choosedday = []
let toschool = '2021-8-30'
let code = false
let qrcodeWidth= 150
const quality = 1
let codeText = 'dwdwefewfw'
let table = [
  {
    campu:"奉贤校区",
    time_index:[
    ["8:20","9:05"],
    ["9:10","9:55"],
    ["10:15","11:00"],
    ["11:05","11:50"],
    ["13:00","13:45"],
    ["13:50","14:35"],
    ["14:55","15:40"],
    ["15:45","16:30"],
    ["18:00","18:45"],
    ["18:50","19:35"],
    ["19:40","20:25"]
  ],
  first:[
    ["8:20","9:05"],
    ["9:10","9:55"],
    ["10:25","11:00"],
    ["11:05","12:00"],
    ["13:00","13:45"],
    ["13:50","14:35"],
    ["14:55","15:40"],
    ["15:45","16:30"],
    ["18:00","18:45"],
    ["18:50","19:35"],
    ["19:40","20:25"]
  ],
  second:[
    ["8:20","9:05"],
    ["9:10","9:55"],
    ["10:15","11:00"],
    ["11:05","11:45"],
    ["13:00","13:45"],
    ["13:50","14:35"],
    ["14:55","15:40"],
    ["15:45","16:30"],
    ["18:00","18:45"],
    ["18:50","19:35"],
    ["19:40","20:25"]
  ]
},
{
  campu:"徐汇校区",
  time_index:[
  ["8:00","8:45"],
  ["8:50","9:35"],
  ["9:55","10:40"],
  ["10:45","11:30"],
  ["13:00","13:45"],
  ["13:50","14:35"],
  ["14:55","15:40"],
  ["15:45","16:30"],
  ["18:00","18:45"],
  ["18:50","19:35"],
  ["19:40","20:25"]
  ]
},
]
let list = []
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
    date, days, timetableMode, list, tapSet, page, this_week, startWeek, course_data, choosedday, discipline, page_day, toschool, code, wlist, colorArrays,qrcodeWidth,quality,codeText,choosedCouple,table
  },
  //导航栏函数
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick,

  setdata:function(e){
    let _this = this
    let Data;
    let year = 2021
    let semester = 1
    let url = `${app.globalData.commonUrl}${timeTableSuffix}?year=${year}&semester=${semester}`;
    let header = getHeader("urlencoded", app.globalData.token);
    let data = {};
    let tapDate = requestUtils.doGET(url, data, header);
    tapDate.then((res) => {
      data = res.data.data.timeTable
      _this.setData({
        list: data
      })
      Data = _this.binary(data, _this.data.this_week, _this.data.choosedday);
      wx.setStorageSync('timetable_list', data)
    })
    return Data;
  },

  time: function (schoolholidaydirectory, giventime) {
    let _this = this
    let date = _this.data.date
    let this_week = timeUtils.getIntervalToCurrentWeek(schoolholidaydirectory, giventime);
    if (_this.data.startWeek == 0) { _this.data.startWeek = this_week }
    date = timeUtils.getTimeOfWeek(giventime);
    date.map(el => {
      if (el.week == 0) { el.weeks = '日';el.week=7; return el; }
      else if (el.week == 1) { el.weeks = '一'; return el; }
      else if (el.week == 2) { el.weeks = '二'; return el; }
      else if (el.week == 3) { el.weeks = '三'; return el; }
      else if (el.week == 4) { el.weeks = '四'; return el; }
      else if (el.week == 5) { el.weeks = '五'; return el; }
      else if (el.week == 6) { el.weeks = '六'; return el; }
    })
    let nowdate = new Date();
    nowdate = nowdate.getDay();
    if(nowdate == 0){nowdate = 7}
    _this.data.choosedday.week = nowdate
    _this.setData({
      date: date,
      days: _this.data.days,
      choosedday: { week: nowdate },
      this_week: this_week,
      startWeek: _this.data.startWeek
    })
  },

  table: function (e){
    let _this = this;
    let table = _this.data.table
    let y=0
    for(let i = 0; i < e.length; i++) { 
        if(e[i].campus== table[0].campu){
          if(e[i].place.search("一教")!==-1)
          {
            for(let x=0;x< e[i].table.length;x++){
              if(e[i].table[x]==1&&y==0){
                e[i].tables=[]
                e[i].tables[0]=table[0].first[x][0]
                y=1
              }else if(e[i].table[x]==0&&y==1){
                e[i].tables[1]=table[0].first[x-1][1]
                y=0
              }
            }
          }else if(e[i].place.search("二教")!==-1){ 
            for(let x=0;x< e[i].table.length;x++){
              if(e[i].table[x]==1&&y==0){
                e[i].tables=[]
                e[i].tables[0]=table[0].second[x][0]
                y=1
              }else if(e[i].table[x]==0&&y==1){
                e[i].tables[1]=table[0].second[x-1][1]
                y=0
              }
            }
          }else{
            for(let x=0;x< e[i].table.length;x++){
              if(e[i].table[x]==1&&y==0){
                e[i].tables=[]
                e[i].tables[0]=table[0].second[x][0]
                y=1
              }else if(e[i].table[x]==0&&y==1){
                e[i].tables[1]=table[0].second[x-1][1]
                y=0
              }
            }
          }
        }else{
          for(let x=0;x< e[i].table.length;x++){
            if(e[i].table[x]==1&&y==0){
              e[i].tables=[]
              e[i].tables[0]=table[1].time_index[x][0]
              y=1
            }else if(e[i].table[x]==0&&y==1){
              e[i].tables[1]=table[1].time_index[x-1][1]
              y=0
            }
          }
      }
    }
    let textlist = e
    console.log(textlist)
    return textlist;
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
    let course_data 
    _this.data.list = wx.getStorageSync('timetable_list');
    // _this.data.table = wx.getStorageSync('table');
    // _this.data.toschool = wx.getStorageSync('toschool');
    if(wx.getStorageSync('timetableMode')==0){
    wx.setStorageSync('timetableMode',1)}
    _this.data.timetableMode = wx.getStorageSync('timetableMode');
    _this.time(_this.data.toschool, new Date());
    if(_this.data.list.length == 0){
      course_data = _this.setdata()
    }else{
      course_data = _this.binary(_this.data.list, _this.data.this_week, _this.data.choosedday);}
    _this.setData({ 
      list: _this.data.list, 
      course_data: course_data,
      table: _this.data.table,
      toschool: _this.data.toschool,
      timetableMode: _this.data.timetableMode});
  },
  binary: function (list, this_week, day) {
    console.log(this_week, day.week)
    let discipline = this.data.discipline.discipline
    let newlist = []
    let textlist = []
      list.map(el => {
        el.weeks = transformationsUtils.transformations(el.week, 32)
        el.table = transformationsUtils.transformations(el.timeIndex,32)
      })
    newlist = list.filter(el => el.weeks[this_week-1] == "1")
    textlist = newlist.filter(el => el.day == day.week)
    textlist.sort((a, b) => a.time_index - b.time_index)
    for (let i = 0; i < textlist.length; i++) {
      for (let j = 0; j < discipline.length; j++) {
        // console.log(textlist[i].course_name == discipline[j].discipline)
        if (textlist[i].courseName === discipline[j].subject) {
          console.log(discipline[j].discipline)
          textlist[i].discipline = discipline[j].discipline}
      }
      if(!textlist[i].discipline){
        textlist[i].discipline = "generality"
      }
    }
    let result = this.table(textlist)
    console.log(textlist)
    return result
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
  onShow: function () {
    let _this=this

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
    let timetableMode = _this.data.timetableMode;
    if (timetableMode == 1) {
      timetableMode = 2;
      _this.setData({
        timetableMode: timetableMode
      })
    } else if (timetableMode == 2) {
      timetableMode = 1;
      _this.setData({
        timetableMode: timetableMode
      })
    }
    wx.setStorage({
      key: 'timetableMode',
      data: timetableMode,
    })
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
    if(this_week==0) {this_week=1}
    this.setData({
      navState: index,
      page: page,
      this_week: this_week
    })
    _this.changeTime(_this.data.toschool, this_week)
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
    if (_this.data.choosedday.week == 8) {
      _this.data.choosedday.week = 1;
      _this.data.this_week++;
      _this.changeTime(_this.data.toschool, _this.data.this_week)
    }

    if (_this.data.choosedday.week == 0) {
      _this.data.this_week--;
      if(_this.data.this_week==0) {_this.data.this_week=1}
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
    if(this.data.choosedCouple == false){
    this.setData({choosedCouple:true})}
    else{
      this.setData({choosedCouple:false})
    }
  },
  collapse() {
    if (this.data.tapSet === true) {
      this.setData({ tapSet: false });
    }
  }
})