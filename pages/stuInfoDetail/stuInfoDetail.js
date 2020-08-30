//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userDetail:undefined,
    motto: 'Hey!',
    avatarUrl:"/asset/pic/sxc.png",
    nickName:"孙笑川",
    name:undefined,
    // // 学号
    // stuId:"12345678",
    // // 学院
    // college:"环境管理方法学（大量开始建立饭卡机刷卡记录）",
    // // 专业
    // profession:"XXX",
    // // 寝室
    // bedroom:"XXX号楼XXX室",
    // // 辅导员姓名
    // counselorName:"XXX",
    // // 辅导员电话
    // counselorPhone:"123456789",
    token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc19hZG1pbiI6dHJ1ZSwidWlkIjoxMH0.tY2adWTqpK21lqquSbxYLT3Zvwn83q8K0U0J59oeeFM"
  },

  gotoModify(e){

    wx.navigateTo({
      url: '/pages/inputInfo/inputInfo?isHidden=true',
    })

  },

  gotoNewFriend(e){
    wx.navigateTo({
      url: '/pages/newFriend/newFriend',
    })
  },

  gotoClass(e){
    wx.navigateTo({
      url: '/pages/newClass/newClass',
    })
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
    if (this.data.name == undefined && this.data.userDetail == undefined)
    {
      // 获取头像昵称
      this.setData({
        avatarUrl:app.globalData.userAvater,
        nickName:app.globalData.nickName
      })
      // console.log(app.globalData.commonUrl+"/freshman/"+app.globalData.userInput.name_examNumber);
      // console.log(app.globalData.userInput.id);
      // console.log(that.data.token);
      // 获取用户的详细信息
      wx.request({
        url: `${app.globalData.commonUrl}/freshman/${app.globalData.userInput.name_examNumber}`,
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
          app.globalData.userDetail = res.data.data;
          that.setData({
            userDetail:res.data.data
          })
        },
      })
    }
  }
})