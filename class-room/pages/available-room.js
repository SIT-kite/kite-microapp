const dayjs = require('../components/dayjs/index')

import {
  handlerGohomeClick,
  handlerGobackClick
} from '../../utils/navBarUtils';
import getHeader from "../../utils/requestUtils.getHeader";

const app =  getApp();
const availableSuffix = `/edu/classroom/available`;
const requestUtils = require("../../utils/requestUtils");
const promisify = require('../../utils/promisifyUtils');
const wxShowModal = promisify(wx.wxShowModal);


const timeIntervals = {
  1: [{h: 6, m: 0}, {h: 8, m: 45}],
  2: [{h: 8, m: 45}, {h: 9, m: 40}],
  3: [{h: 9, m: 40}, {h: 10, m: 40}],
  4: [{h: 10, m: 40}, {h: 11, m: 35}],
  5: [{h: 11, m: 35}, {h: 12, m: 30}],
  6: [{h: 12, m: 30}, {h: 14, m: 15}],
  7: [{h: 14, m: 15}, {h: 15, m: 10}],
  8: [{h: 15, m: 10}, {h: 16, m: 10}],
  9: [{h: 16, m: 10}, {h: 17, m: 5}],
  10: [{h: 17, m: 5}, {h: 18, m: 0}],
  11: [{h: 18, m: 0}, {h: 19, m: 15}],
  12: [{h: 19, m: 15}, {h: 20, m: 10}],
  13: [{h: 20, m: 10}, {h: 21, m: 5}],
  14: [{h: 21, m: 5}, {h: 22, m: 30}]
}

const campuses = ["奉贤校区", "徐汇校区"]
let choosedCampus = "奉贤校区"

const buildings = {
  "奉贤校区": ["一教", "二教"],
  "徐汇校区": ["教学楼","南图"]
}

let choosedBuilding= "一教"
let data_content = {}

Page({
  data: { campuses, choosedCampus, buildings, choosedBuilding, hideBottom: true ,index:1,data_content},

  // 导航栏函数
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick,

  setcampuses: function (){
    return this.data.choosedCampus;
  },
  
  loadmore: function(){
    let self = this;
    setTimeout(function(){
      console.log('上拉加载更多');
      let pages = self.data.index;
      pages = pages+1;
      self.setData({
        index: pages,
        hideBottom:false
      })
      let campus;
      if (self.data.choosedCampus == "奉贤校区") {
        campus = 1;
      } else if(self.data.choosedCampus == "徐汇校区")
      { campus = 2 ;}
      let index = self.data.index;
      let available = `?campus=${campus}&date=${this.data.choosedDate}&building=${self.data.choosedBuilding}&index=${index}`;
      let url = `${app.globalData.commonUrl}${availableSuffix}${available}`;
      let header = getHeader("urlencoded", app.globalData.token);
      let data = {};
      let data_initial = {};
      let data_content = self.data.data_content;
      let tapDate = requestUtils.doGET(url, data, header);
      tapDate.then((res) => {
        data_initial = res.data.data
        for (var i = 0; i < data_initial.length; i++) {
          let datas = data_initial[i];
          datas.busy_time = self.ten_two(datas.busy_time);
        }
        data_content=data_content.concat(data_initial);
        self.setData({
          data: data_content,
          data_content:data_content,
          hideBottom :true
        })
      })
    },100);


  },

  ten_two: function(times){
　　var two=parseInt(times).toString(2);
　　var Point=[];
　　if(two.length<11){
　　　　for(var j=0;j<(11-two.length);j++){
　　　　　　Point.push('0')
　　　　}
　　}
　　for(var k=0;k<two.length;k++){
　　　　Point.push(two.charAt(k))

　　}
　　return Point; 
  },

  onLoad: function(options) {
    let _this = this
    let now = dayjs()
    let today = now.startOf('day')
    let data = {};
    let data_initial = {};
    let dates = []
    for (let i of [0, 1, 2, 3, 4, 5, 6]) {
      let day = today.add(i, 'day')
      dates.push(day.format('YYYY-MM-DD'))
    }
    let campus;
    if (this.data.choosedCampus == "奉贤校区") {
      campus = 1;
    } else if(this.data.choosedCampus == "徐汇校区")
    { campus = 2 ;} 
    _this.setData({
      data: 0
    })
    let  available = `?campus=${campus}&date=${dates[0]}&building=${this.data.choosedBuilding}`;
    let url = `${app.globalData.commonUrl}${availableSuffix}${available}`;
    let header = getHeader("urlencoded", app.globalData.token);
    let tapDate = requestUtils.doGET(url, data, header);
    let data_content = _this.data.data_content
    tapDate.then((res) => {
      data_initial = res.data.data
      for (var i = 0; i < data_initial.length; i++) {
        let datas = data_initial[i];
        datas.busy_time = this.ten_two(datas.busy_time);
      }
      data_content = data_initial
      _this.setData({
        data: data_content,
        data_content :data_initial
      })
    })

    
  },

  onShow: function() {
    let now = dayjs()
    let today = now.startOf('day')
    let nowInterval = 0
    for (let i in timeIntervals) {
      let startTime = today.add(timeIntervals[i][0].h, 'hour').add(timeIntervals[i][0].m, 'minute')
      let endTime = today.add(timeIntervals[i][1].h, 'hour').add(timeIntervals[i][1].m, 'minute')
      if (now.isAfter(startTime) && now.isBefore(endTime)) {
        nowInterval = i
        break
      }
    }

    let dates = []
    for (let i of [0, 1, 2, 3, 4, 5, 6]) {
      let day = today.add(i, 'day')
      dates.push(day.format('YYYY-MM-DD'))
    }

    let choosedDate = dates[0]

    this.setData({ dates, choosedDate, nowInterval })
  },

  tapDate: function(event) {
    let _this = this
    const date = event.currentTarget.dataset.date
    this.setData({ choosedDate: date })
    _this.setData({
      data: 0
    })
    let pages = _this.data.index;
    pages=0;
    _this.setData({
      index :pages
    })
    let campus;
    if (this.data.choosedCampus == "奉贤校区") {
      campus = 1;
    } else if(this.data.choosedCampus == "徐汇校区")
    { campus = 2 ;}
    let available = `?campus=${campus}&date=${this.data.choosedDate}&building=${this.data.choosedBuilding}`;
    _this.setData({
      data: 0
    })
    let url = `${app.globalData.commonUrl}${availableSuffix}${available}`;
    let header = getHeader("urlencoded", app.globalData.token);
    let data = {};
    let data_initial = {};
    let data_content = _this.data.data_content
    _this.setData({
      data_content:[]
    })
    let tapDate = requestUtils.doGET(url, data, header);
    tapDate.then((res) => {
      data_initial = res.data.data
      for (var i = 0; i < data_initial.length; i++) {
        let datas = data_initial[i];
        datas.busy_time = this.ten_two(datas.busy_time);
      }
      data_content = data_initial
      _this.setData({
        data: data_content
      })
    })

  },

  tapCampus: function(event) {
    let _this = this
    const campus = event.currentTarget.dataset.campus
    this.setData({ choosedCampus: campus, choosedBuilding: buildings[campus][0] })
    let pages = _this.data.index;
    pages=0;
    _this.setData({
      index :pages
    })
    let Campus;
    if (this.data.choosedCampus == "奉贤校区") {
      Campus = 1;
    } else if(this.data.choosedCampus == "徐汇校区")
    { Campus = 2; }
    let available = `?campus=${Campus}&date=${this.data.choosedDate}&building=${this.data.choosedBuilding}`;
    _this.setData({
      data: 0
    })
    let url = `${app.globalData.commonUrl}${availableSuffix}${available}`;
    let header = getHeader("urlencoded", app.globalData.token);
    let data = {};
    let data_initial = {};
    let data_content = _this.data.data_content
    _this.setData({
      data_content:[]
    })
    let tapDate = requestUtils.doGET(url, data, header);
    tapDate.then((res) => {
      data_initial = res.data.data
      for (var i = 0; i < data_initial.length; i++) {
        let datas = data_initial[i];
        datas.busy_time = this.ten_two(datas.busy_time);
      }
      data_content = data_initial
      _this.setData({
        data: data_content
      })
    })
  },

  tapBuilding: function(event) {
    let _this = this
    const building = event.currentTarget.dataset.building;
    this.setData({ choosedBuilding: building });
    let campus;
    let pages = _this.data.index;
    pages=0;
    _this.setData({
      index :pages
    })
    if (this.data.choosedCampus == "奉贤校区") {
      campus = 1 ;  
    } else if(this.data.choosedCampus == "徐汇校区")
    { campus = 2 ;}
    let available = `?campus=${campus}&date=${this.data.choosedDate}&building=${this.data.choosedBuilding}`;//${this.data.choosedDate}
    _this.setData({
      data: 0
    })
    let url = `${app.globalData.commonUrl}${availableSuffix}${available}`;
    let header = getHeader("urlencoded", app.globalData.token);
    let data = {};
    let data_initial = {};
    let data_content = _this.data.data_content
    _this.setData({
      data_content:[]
    })
    let tapDate = requestUtils.doGET(url, data, header);
    tapDate.then((res) => {
      data_initial = res.data.data
      for (var i = 0; i < data_initial.length; i++) {
        let datas = data_initial[i];
        datas.busy_time = this.ten_two(datas.busy_time);
      }
      data_content=data_initial
      _this.setData({
        data: data_content
      })
    })

  }
})

