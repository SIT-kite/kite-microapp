// pages/consume/electricity/electricity.js
import { handlerGohomeClick, handlerGobackClick } from '../../../utils/navBarUtils'
const app = getApp();
const electricitySuffix = `/pay/room/`;
const requestUtils = require("../../../utils/requestUtils");
const promisify = require('../../../utils/promisifyUtils');
const wxShowModal = promisify(wx.showModal);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    roomID: "",
    electricityData:{
      balance: 0,
      power: 0,
      room: 0,
      date:"",
      time:""
    },
    message: "",
  },
  // 导航栏函数
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick,

  onClose: function(){
    this.setData({
      show: false,
    })
  },
  onClickIcon: () =>{
    
  },
  bindroomID:function(e){
    this.setData({
      roomID:e.detail.value
    })
    console.log(this.data.roomID)
  },
  getEletricityConsume: function(){
    let url = `${app.globalData.commonUrl}${electricitySuffix}${this.data.roomID}`;
    let header = {
      "content-type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${app.globalData.token}`,
    };
    let data = {
      roomId: this.data.roomID
    }
    let getEletricityConsume = requestUtils.doGET(url, data, header);
    getEletricityConsume.then((res) => {
      let data = res.data.data
      data.date = data.ts.split('T')[0]
      data.time = data.ts.split('T')[1].substr(0,5)
      this.setData({
        electricityData: data,
        show:true
      });
      
      // let message = `余额: ${this.data.electricityData.balance.toFixed(2)}元\r\n电量: ${this.data.electricityData.power.toFixed(2)}度`;
      // this.setData({
      //   message: message,
      //   show: true,
      // });
      // wxShowModal({
      //   title: "查询结果",
      //   content: message,
      //   showCancel: false,
      // });
    }).catch(res => {
      wxShowModal({
        content: "出错了",
      });
    })

  },
  showtips:function(){
    console.log("我出发了")
    const tips ="'10'+1~2位楼号+3~4位房间号"
  wxShowModal({
    title:"填写格式",
    content:tips,
    showCancel: false
  })
  },
  // focus: function(){
  //   this.setData({
  //     roomID: ""
  //   });
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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