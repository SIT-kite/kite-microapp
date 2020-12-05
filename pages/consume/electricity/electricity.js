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
    roomID: "请输入房间号",
    electricityData:{
      balance: 0,
      power: 0,
      room: 0,
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
      console.log(res);
      this.setData({
        electricityData: res.data.data,
      });
      
      let message = `余额: ${this.data.electricityData.balance.toFixed(2)}元\r\n电量: ${this.data.electricityData.power.toFixed(2)}度`;
      // this.setData({
      //   message: message,
      //   show: true,
      // });
      wxShowModal({
        title: "查询结果",
        content: message,
        showCancel: false,
      });
    }).catch(res => {
      wxShowModal({
        content: "出错了",
      });
    })

  },
  focus: function(){
    this.setData({
      roomID: ""
    });
  },
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