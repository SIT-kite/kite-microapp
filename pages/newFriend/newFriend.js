// pages/newFriend/newFriend.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc19hZG1pbiI6dHJ1ZSwidWlkIjoxMH0.tY2adWTqpK21lqquSbxYLT3Zvwn83q8K0U0J59oeeFM",
    // roommates:undefined,
    roommates: [
      {
        avatar: "../../asset/pic/sxc.png",
        bed: "630-02",
        building: "18号楼",
        college: "计算机科学和信息工程学院",
        contact: {
          "qq":"2917021186",
          "wechat":"wxid_syhw2malo8xb22"
        },
        gender: "M",
        lastSeen:"2020-08-31T16:18:57",
        major: "软件工程",
        name: "穆耶赛尔·托合提库尔班",
        province: "黑龙江",
        room: 630
      },
      {
        avatar: "../../asset/pic/avatar02.jpg",
        bed: "630-04",
        building: "18号楼",
        college: "计算机科学和信息工程学院",
        contact: {
          "qq":"2917021186",
          "wechat":""
        },
        gender: "M",
        lastSeen:"2020-08-30T16:18:57",
        major: "电气工程及其自动化(轨道供电牵引方向)",
        name: "邵毅康",
        province: "上海",
        room: 630
      },
      {
        avatar: "https://kite.sunnysab.cn/static/icon.png",
        bed: "630-03",
        building: "18号楼",
        college: "人文学院",
        contact: null,
        gender: "M",
        lastSeen: "2020-07-30T16:18:57",
        major: "公共管理类",
        name: "赵星然",
        province: "吉林",
        room: 630
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
    if (this.data.roommates == undefined)
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
            roommates:res.data.data
          })
        },
      })
    }
    for(var i =0;i<this.data.roommates.length;i++){
      this.data.roommates[i].lastSeen = util.getIntervalToCurrentTime(that.data.roommates[i].lastSeen);
      this.data.roommates[i].isHidden = {
        "qq":null,
        "wechat":null
      }
      if (this.data.roommates[i].contact == null){
        this.data.roommates[i].isHidden.qq = true;
        this.data.roommates[i].isHidden.wechat = true;
      }
      else{
        this.data.roommates[i].isHidden.qq = this.data.roommates[i].contact.qq == ""?true:false;
        this.data.roommates[i].isHidden.wechat = this.data.roommates[i].contact.wechat == ""?true:false;
      }
    }
    // console.log(that.data.roommates[0].lastSeen);

    // console.log(util.getIntervalToCurrentTime(that.data.roommates[0].lastSeen));
    // console.log(this.data.roommates);
    this.setData({
      roommates:this.data.roommates
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