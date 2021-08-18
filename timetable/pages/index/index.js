//TODO 完成：主体框架设计、完成时间、周数 未完成：日课表块、数据请求、数据处理、数据缓存、课程icon
import {
  handlerGohomeClick,
  handlerGobackClick
}from'../../../utils/navBarUtils';
import getHeader from "../../../utils/getHeader";

const app = getApp();
const availableSuffix = `/contact`;
const requestUtils = require("../../../utils/requestUtils");
let date = []
let days = []
let chooseActivity = 1
let list = [
{
  course_name: "机械原理",
  day : 1,
  time_index : 4,
  weeks : 68,
  place : "A102",
  teacher : "张建国",
  campus : "奉贤校区",
  credit : 3,
  hours : 64,
  dyn_class_id : 2000235,
  course_id : 2222
},
{
  course_name: "c语言",
  day : 2,
  time_index : 4,
  weeks : 52,
  place : "A102",
  teacher : "张建国",
  campus : "奉贤校区",
  credit : 3,
  hours : 64,
  dyn_class_id : 2000235,
  course_id : 2222
},
{
  course_name: "高等数学",
  day : 1,
  time_index : 2,
  weeks : 68,
  place : "A102",
  teacher : "张建国",
  campus : "奉贤校区",
  credit : 3,
  hours : 64,
  dyn_class_id : 2000235,
  course_id : 2222
},
]
Page({
  data:{colorArrays: [ "#81ecec", "rgba(116, 185, 255,5.0)", "#bfa", "rgba(162, 155, 254,1.0)", "rgba(255, 118, 117,1.0)", "rgba(85, 239, 196,1.0)", "rgba(232, 67, 147,1.0)", "rgba(116, 185, 255,1.0)"],
  wlist: [
    { "week_what": 1, "section_what": 1, "time": 3, "content": "高等数学@一教A-302" },
    { "week_what": 1, "section_what": 5, "time": 3, "content": "大学物理@教A-301" },
    { "week_what": 2, "section_what": 1, "time": 2,"content":"初级通用学术英语@教A-301"},
    { "week_what": 2, "section_what": 8, "time": 2, "content": "计算机网络@教A-301" },
    { "week_what": 3, "section_what": 4, "time": 1, "content": "计算机组成原理@教A-301" },
    { "week_what": 3, "section_what": 8, "time": 1, "content": "高等数学@教A-301" },
    { "week_what": 3, "section_what": 5, "time": 2, "content": "线性代数@教A-301" },
    { "week_what": 4, "section_what": 2, "time": 3, "content": "巫术@教A-301" },
    { "week_what": 4, "section_what": 8, "time": 2, "content": "高等数学@教A-301" },
    { "week_what": 5, "section_what": 1, "time": 2, "content": "羽毛球@教A-301" },
    { "week_what": 6, "section_what": 3, "time": 2, "content": "三国杀@教A-301" },
    { "week_what": 7, "section_what": 5, "time": 3, "content": "高等数学@教A-301" },
  ],
  date,days,chooseActivity,list
  },
  //导航栏函数
handlerGohomeClick: handlerGohomeClick,
handlerGobackClick: handlerGobackClick,

time: function(){
  let _this = this
  let date = _this.data.date
  let day 
  let month 
  let year 
  let week
  let start = Date.parse(new Date("2021-8-1"))
  console.log(start)
  var nowdate = Date.parse(new Date());
  let newdate = 0
  let this_week = Math.ceil((nowdate-start)/604800000)
newdate = new Date(nowdate);
  week = newdate.getDay();
  for (let i = 0; i <week;i++) {
    newdate = nowdate - 86400000*(week-i);
    newdate = new Date(newdate);
    day = newdate.getDate();
    year = newdate.getFullYear();
    month = newdate.getMonth() +1;
    newdate = year+'年' + month+ '月';
    date.push(newdate);
    _this.data.days.push({
      day:day,
      week :i
    });
  }
  for (let i = week; i <7;i++) {
    newdate = nowdate + 86400000*(i-week);
    newdate = new Date(newdate);
    day = newdate.getDate();
    year = newdate.getFullYear();
    month = newdate.getMonth() +1;
    newdate = year+'年' + month+ '月';
    date.push(newdate);
    _this.data.days.push({
      day:day,
      week : i
    });
  }
  _this.data.days.map(el=>{
    if(el.week==0){el.week='一';return el;}
    else if(el.week==1){el.week='二';return el;}
    else if(el.week == 2){el.week='三';return el;}
    else if(el.week ==3){el.week='四';return el;}
    else if(el.week ==4){el.week='五';return el;}
    else if(el.week ==5){el.week='六';return el;}
    else if(el.week ==6){el.week='日';return el;}
  })
  nowdate = new Date();
  nowdate = nowdate.getDate();
  
  _this.setData({
    date:date,
    days : _this.data.days,
    choosedday : {day :nowdate},
    this_week : this_week
  })
},

onLoad: function(options) {
  let _this = this
  _this.time();
  console.log(date)
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

  tapDays: function(e){
    let date = e.currentTarget.dataset.days;
    this.setData({choosedday:date})
  },

  tapActivity: function(e){
    let _this = this;
    let chooseActivity = _this.data.chooseActivity;
    if (chooseActivity==1){
      chooseActivity =2;
      _this.setData({
        chooseActivity :chooseActivity
      })
    }else if(chooseActivity==2){
      chooseActivity=1;
      _this.setData({
        chooseActivity :chooseActivity
      })
    }
  }
})