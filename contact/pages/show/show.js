// phone/pages/phone.js
//TODO 已完成 基本框架样式、请求、缓存、30天更新，待完成 搜索、菜单跟随、菜单弹出、复制拨打、UI优化
import {
    handlerGohomeClick,
    handlerGobackClick
}from'../../../utils/navBarUtils';
import getHeader from "../../../utils/getHeader";

const app = getApp();
const availableSuffix = `/contact`;
const requestUtils = require("../../../utils/requestUtils");
const promisify = require('../../../utils/promisifyUtils');

let department=["资管处","档案馆","教务处","团委","人事处",
"信息化技术中心","审计处","国际交流处","学生工作部","科学技术研究院","安全保卫处"
,"后勤保障中心","校长办公室","宣传部","财务处","工会","基建处","党委办公室","离退委","研究生院","组织部"]
let mydata=[]
let date = 0
let newdate =0
Page({

  /**
   * 页面的初始数据
   */
  data: {
department,mydata,date,newdate
  },
//导航栏函数
handlerGohomeClick: handlerGohomeClick,
handlerGobackClick: handlerGobackClick,
setdata: function(){
    let _this = this
    _this.setDate();
    let url = `${app.globalData.commonUrl}${availableSuffix}`;
    let header = getHeader("urlencoded", app.globalData.token);
    let data = {};
    let tapDate = requestUtils.doGET(url, data, header);
    tapDate.then((res) =>{
        data = res.data.data
        _this.setData({
            data: data
        })
        wx.setStorage({
            key: 'mydata',
            data: data
        })
    })
},
    setDate: function (){
        let _this = this
        let date = _this.data.date
        date = Date.parse(new Date());
        date = date + 2592000000;
        wx.setStorageSync('mydate', date);
        _this.setData({date})
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let mydata = _this.data.mydata
    let date = _this.data.date
    let newdate = _this.data.newdate
    newdate = Date.parse(new Date());
    date =  wx.getStorageSync('mydate');
    _this.setData({newdate,date});
    wx.getStorage({
        key: 'mydata',
        success: function (res) {
            mydata = res.data;
            _this.setData({
                data : mydata,
                mydata
            })
        }
    })
    if(mydata.length == 0 ||date<newdate){
        _this.setdata();
        _this.setData({newdate,date})
    }
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

  }
})