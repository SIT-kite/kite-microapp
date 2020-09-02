//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userDetail:null,
    motto: 'Hey!',
    avatarUrl:"",
    nickName:"",
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
    var that = this;
    // 如果本地没有此信息，则是第一次加载
    if (app.globalData.userDetail == null){
      // console.log(app.globalData.commonUrl+"/freshman/"+app.globalData.userInfo.name_examNumber);
      // console.log(app.globalData.userInfo.id);
      console.log(app.globalData.token);
      // 获取用户的详细信息
      console.log("request.get info");
      wx.request({
        url: `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.name_examNumber}`,
        method:"GET",
        data:{
          "secret": `${app.globalData.userInfo.id}`
        },
        header:{
          "content-type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${app.globalData.token}`,
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
    else{
      that.setData({
        userDetail:app.globalData.userDetail,
        avatarUrl:app.globalData.userAvatar,
        nickName:app.globalData.nickName
      })
    }
  }
})