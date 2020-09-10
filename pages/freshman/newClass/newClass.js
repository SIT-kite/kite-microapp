// pages/newClass/newClass.js
import {handlerGohomeClick,handlerGobackClick} from '../../../utils/navBarUtils'
var app = getApp();
var util = require("../../../utils/utils.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classmates:null
  },
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick,

  pageDataInit: function(){
    var that = this;
    if (app.globalData.classmates == null){
      console.log("request");
      wx.showLoading({
        title: '加载中',
        mask: true,
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });


      let url = `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}/classmate`;
      console.log(`url: ${url}`)
      wx.request({
        url: url,
        method:"GET",
        data:{
          "secret": `${app.globalData.userInfo.secret}`
        },
        header:{
          "content-type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${app.globalData.token}`,
        },
        success(res){
          if(res.data.code == 0){
            // console.log(res.data);
            var stuList = res.data.data.classmates;
            for(var i =0;i<stuList.length;i++){
              stuList[i].genderImage = stuList[i].gender == "M"? "/asset/icon/male.png":"/asset/icon/female.png";
              stuList[i].lastSeen = util.getIntervalToCurrentTime(stuList[i].lastSeen);
              stuList[i].isHidden = {
                "qq":null,
                "wechat":null,
                "padding":null
              }
              if (stuList[i].contact == null){
                stuList[i].isHidden.qq = true;
                stuList[i].isHidden.wechat = true;
              }
              else{
                stuList[i].isHidden.qq = stuList[i].contact.qq == ""?true:false;
                stuList[i].isHidden.wechat = stuList[i].contact.wechat == ""?true:false;
                stuList[i].isHidden.padding = stuList[i].isHidden.wechat == true?25:0;
              }
            }
            app.globalData.classmates = res.data.data.classmates;
            that.setData({
              classmates:stuList
            });
            wx.hideLoading();
          }else{
            wx.showModal({
              title:"哎呀，出错误了>.<",
              content:res.data,
              showCancel:false,
              success(res){}
            })
          }
        },
        fail(res){
          wx.showModal({
            title:"哎呀，出错误了>.<",
            content:"网络不在状态",
            showCancel:false,
            success(res){}
          })
        }
      })
    }else{
      console.log("本地已保存 classmates 数据");
      this.setData({
        classmates: app.globalData.classmates
      })
    }
  },
  pageDataFresh: function(){
    var that = this;
    var reqTask = wx.request({
      url: `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}/classmate`,
      data:{
        "secret": `${app.globalData.userInfo.secret}`
      },
      header:{
        "content-type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${app.globalData.token}`,
      },
      method: 'GET',
      success: (result)=>{
        if(result.data.code == 0){
          // console.log(res.data);
          var stuList = result.data.data.classmates;
          for(var i =0;i<stuList.length;i++){
            stuList[i].genderImage = stuList[i].gender == "M"? "/asset/pic/boy.png":"/asset/pic/girl.png";
            stuList[i].lastSeen = util.getIntervalToCurrentTime(stuList[i].lastSeen);
            stuList[i].isHidden = {
              "qq":null,
              "wechat":null,
              "padding":null
            }
            if (stuList[i].contact == null){
              stuList[i].isHidden.qq = true;
              stuList[i].isHidden.wechat = true;
            }
            else{
              stuList[i].isHidden.qq = stuList[i].contact.qq == ""?true:false;
              stuList[i].isHidden.wechat = stuList[i].contact.wechat == ""?true:false;
              stuList[i].isHidden.padding = stuList[i].isHidden.wechat == true?25:0;
            }
          }
          app.globalData.classmates = result.data.data.classmates;
          that.setData({
            classmates:stuList
          });
        }else{
          wx.showModal({
            title:"哎呀，出错误了>.<",
            content:res.data,
            showCancel:false,
            success(res){}
          })
        }

      },
      fail: ()=>{},
      complete: ()=>{
        that.onLoad();
        that.onShow();
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("页面 newClass onLoad...");
    this.pageDataInit();
    
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
    wx.stopPullDownRefresh();

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
  onPullDownRefresh: function(){
    console.log("页面 newClass 刷新中");
    this.pageDataFresh();
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    return {
      title: "上应小风筝",
      path: "pages/index/index"
    }
  }
})