// pages/newClass/newClass.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc19hZG1pbiI6dHJ1ZSwidWlkIjoxMH0.tY2adWTqpK21lqquSbxYLT3Zvwn83q8K0U0J59oeeFM",
    classmates:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var util = require("../../utils/utils.js");
    console.log("onload");
    var that = this;
    if (this.data.classmates == null){
      console.log("request");
      wx.request({
        // url: `${app.globalData.commonUrl}/freshman/${app.globalData.userInput.name_examNumber}/classmate`,
        url:"https://kite.sunnysab.cn/api/v1/freshman/宋安邦/classmate",
        method:"GET",
        data:{
          // "secret": `${app.globalData.userInput.id}`
          "secret":"120419"
        },
        header:{
          "content-type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${that.data.token}`,
        },
        success(res){
          console.log(res.data);
          var stuList = res.data.data.classmates;
          console.log(stuList);
          for(var i =0;i<stuList.length;i++){
            stuList[i].genderImage = stuList[i].gender == "M"? "../../asset/pic/boy.png":"../../asset/pic/girl.png";
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
        },
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