//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userDetail:null,
    motto: 'Hey!',
    avatarUrl:"",
    nickName:"",
    token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc19hZG1pbiI6dHJ1ZSwidWlkIjoxMH0.tY2adWTqpK21lqquSbxYLT3Zvwn83q8K0U0J59oeeFM"
  },

  gotoModify(e){
    console.log("gotoModify");
    wx.navigateTo({
      url: '/pages/inputInfo/inputInfo?isHidden=none',
    })
  },

  gotoNewFriend(e){
    console.log("gotoNewFriend");
    wx.navigateTo({
      url: '/pages/newFriend/newFriend',
    })
  },

  gotoClass(e){
    console.log("gotoNewClass");
    wx.navigateTo({
      url: '/pages/newClass/newClass',
    })
  },

  onLoad: function () {
    console.log('stuInfoDetail onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
    if (this.data.userDetail == null){
      // console.log(app.globalData.commonUrl+"/freshman/"+app.globalData.userInput.name_examNumber);
      // console.log(app.globalData.userInput.id);
      // console.log(that.data.token);
      // 获取用户的详细信息
      console.log("request.get info");
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
          if (res.data.code == 0){
            app.globalData.userDetail = res.data.data;
            that.setData({
              userDetail:res.data.data,
              avatarUrl:app.globalData.userAvatar,
              nickName:app.globalData.nickName
            })
          }
          else{
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
  }
})