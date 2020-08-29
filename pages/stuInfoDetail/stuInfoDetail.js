//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hey!',
    avatarUrl:"/asset/pic/sxc.png",
    nickName:"孙笑川",
    name:"XXX",
    // 学号
    stuId:"12345678",
    // 学院
    college:"XXX学院",
    // 专业
    profession:"XXX",
    // 寝室
    bedroom:"XXX号楼XXX室",
    // 辅导员姓名
    counselorName:"XXX",
    // 辅导员电话
    counselorPhone:"123456789",
    token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc19hZG1pbiI6dHJ1ZSwidWlkIjoxMH0.tY2adWTqpK21lqquSbxYLT3Zvwn83q8K0U0J59oeeFM"
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
    console.log(app.globalData.commonUrl+"/freshman/"+app.globalData.userInput.name_examNumber);
    console.log(app.globalData.userInput.id);
    console.log(that.data.token);
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
        console.log(456);
        console.log(res);
      },
    })
    this.setData({
      avatarUrl:app.globalData.userAvater,
      nickName:app.globalData.nickName
    })

  }
})