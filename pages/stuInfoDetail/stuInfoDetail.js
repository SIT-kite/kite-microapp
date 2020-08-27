//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hey!',
    userInfo: {
      avatarUrl:"/asset/pic/sxc.png",
      nickName:"孙笑川"
    },
    name:"翠花",
    // 学号
    stuId:"12345678",
    // 学院
    college:"计算机信息与工程学院",
    // 专业
    profession:"电气工程极其自动化(轨道供电牵引方向)",
    // 寝室
    bedroom:"4号楼204室",
    // 辅导员姓名
    counselorName:"赵日天",
    // 辅导员电话
    counselorPhone:"12345678978"
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
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})