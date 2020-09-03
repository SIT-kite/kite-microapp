// pages/newClass/newClass.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classmates:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var util = require("../../utils/utils.js");
    console.log("onload");
    var that = this;
    if (app.globalData.classmates == null){
      console.log("request");
      wx.request({
        url: `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.name_examNumber}/classmate`,
        method:"GET",
        data:{
          "secret": `${app.globalData.userInfo.id}`
        },
        header:{
          "content-type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${app.globalData.token}`,
        },
        success(res){
          if(res.data.code == 0){
            console.log(res.data);
            var stuList = res.data.data.classmates;
            console.log(stuList);
            for(var i =0;i<stuList.length;i++){
              stuList[i].genderImage = stuList[i].gender == "M"? "https://file.peanut996.cn/Resources/static/img/asset/pic/boy.png":"https://file.peanut996.cn/Resources/static/img/asset/pic/girl.png";
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
                console.log(stuList[i].isHidden.padding);
              }
            }
            // console.log(stuList[0].lastSeen);
            // console.log(util.getIntervalToCurrentTime(stuList[0].lastSeen));
            // console.log(stuList);
            that.setData({
              classmates:stuList
            })
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