// pages/newClass/newClass.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc19hZG1pbiI6dHJ1ZSwidWlkIjoxMH0.tY2adWTqpK21lqquSbxYLT3Zvwn83q8K0U0J59oeeFM",
    classmates:[
      {
        avatar: "../../asset/pic/avatar02.jpg",
        bed: "629-04",
        building: "18号楼",
        college: "人文学院",
        contact: {
          "qq":"2917021186",
          "wechat":"wxid_syhw2malo8xb22"
        },
        gender: "M",
        lastSeen: "2020-08-30T16:18:57",
        major: "公共管理类",
        name: "穆耶赛尔·托合提库尔班",
        province: "上海",
        room: 629
      },
      {
        avatar: "../../asset/pic/xxbb.png",
        bed: "1601-02",
        building: "13号楼",
        college: "人文学院",
        contact: {
          "qq":"2917021186",
          "wechat":"123151351"
        },
        gender: "F",
        lastSeen: "2020-08-30T16:18:57",
        major: "公共管理类",
        name: "旭旭宝宝",
        province: "广西",
        room: 1601 
      },
      {
        avatar: "/asset/pic/sxc.png",
        bed: "1601-03",
        building: "13号楼",
        college: "人文学院",
        contact: {
          "qq":"2917021186",
          "wechat":""
        },
        gender: "F",
        lastSeen: "2020-08-30T16:18:57",
        major: "公共管理类",
        name: "孙笑川",
        province: "河北",
        room: 1601
      },
      {
        avatar: "https://kite.sunnysab.cn/static/icon.png",
        bed: "1601-04",
        building: "13号楼",
        college: "人文学院",
        contact: {
          "qq":"2917021186",
          "wechat":""
        },
        gender: "F",
        lastSeen: "2020-08-30T16:18:57",
        major: "公共管理类",
        name: "俞桑瑜",
        province: "上海",
        room: 1601
      },
      {
        avatar: "https://kite.sunnysab.cn/static/icon.png",
        bed: "630-02",
        building: "18号楼",
        college: "人文学院",
        contact: {
          "qq":"2917021186",
          "wechat":""
        },
        gender: "M",
        lastSeen: "2020-08-30T16:18:57",
        major: "公共管理类",
        name: "陆浩頔",
        province: "上海",
        room: 630
      },
      {
        avatar: "https://kite.sunnysab.cn/static/icon.png",
        bed: "1602-01",
        building: "13号楼",
        college: "人文学院",
        contact: null,
        gender: "F",
        lastSeen: "2020-08-30T16:18:57",
        major: "公共管理类",
        name: "吕如嫣",
        province: "安徽",
        room: 1602
      },
      {
        avatar: "https://kite.sunnysab.cn/static/icon.png",
        bed: "1602-02",
        building: "13号楼",
        college: "人文学院",
        contact: {
        },
        gender: "F",
        lastSeen: "2020-08-30T16:18:57",
        major: "公共管理类",
        name: "黄洁凤",
        province: "广西",
        room: 1602
      },
      {
        avatar: "https://kite.sunnysab.cn/static/icon.png",
        bed: "1602-03",
        building: "13号楼",
        college: "人文学院",
        contact: {
          "qq":"2917021186",
          "wechat":"123asfsd32"
        },
        gender: "F",
        lastSeen: "2020-08-30T16:18:57",
        major: "公共管理类",
        name: "孙欣冉",
        province: "黑龙江",
        room: 1602
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var util = require("../../utils/utils.js");
    console.log("onload");
    var that = this;
    if (this.data.classmates == undefined)
    {
 
      wx.request({
        url: `${app.globalData.commonUrl}/freshman/${app.globalData.userInput.name_examNumber}/roommate`,
        method:"GET",
        data:{
          "secret": `${app.globalData.userInput.id}`
        },
        header:{
          "content-type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${that.data.token}`,
        },
        success(res){
          console.log(res.data);
          that.setData({
            classmate:res.data.data
          })
        },
      })
    }

    for(var i =0;i<this.data.classmates.length;i++){
      this.data.classmates[i].genderImage = this.data.classmates[i].gender == "M"? "../../asset/pic/boy.png":"../../asset/pic/girl.png";
      this.data.classmates[i].lastSeen = util.getIntervalToCurrentTime(this.data.classmates[i].lastSeen);
      this.data.classmates[i].isHidden = {
        "qq":null,
        "wechat":null,
        "padding":null
      }
      if (this.data.classmates[i].contact == null){
        this.data.classmates[i].isHidden.qq = true;
        this.data.classmates[i].isHidden.wechat = true;
      }
      else{
        this.data.classmates[i].isHidden.qq = this.data.classmates[i].contact.qq == ""?true:false;
        this.data.classmates[i].isHidden.wechat = this.data.classmates[i].contact.wechat == ""?true:false;
        this.data.classmates[i].isHidden.padding = this.data.classmates[i].isHidden.wechat == true?25:0;
        console.log(this.data.classmates[i].isHidden.padding);
      }
    }
    // console.log(that.data.classmates[0].lastSeen);

    // console.log(util.getIntervalToCurrentTime(that.data.classmates[0].lastSeen));
    // console.log(this.data.classmates);
    this.setData({
      classmates:this.data.classmates
    })
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