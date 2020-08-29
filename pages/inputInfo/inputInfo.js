
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hey!',
    avatarUrl:"",
    nickName:"",
    userInput:{
      name_examNumber:"",
      id:"",
      phoneNumber:"",
      QQ:"",
      WeChat:""
    }
  },

  checkBoxChange (e){
    console.log(e.detail.value);
    // 取消勾选
    if (e.detail.value[0] == undefined){
      wx.showModal({
        title:"取消勾选",
        content:"我们将不会给您推送可能认识的人,并且不会将您推送给他人（同城，同乡..）",
        showCancel:false,
        success(res){
        }
      })
      app.globalData.visible = false;
      console.log(app.globalData.visible);
    }
    // 勾选
    else{
      wx.showModal({ 
        title:"勾选",
        content:"我们将给您推送可能认识的人，包括将您推送给他人（同城，同乡..）",
        showCancel:false,
        success(res){}
      })
      app.globalData.visible = true;
      console.log(app.globalData.visible);
    }
  },

  gotoStuInfoDetail(e){
    if (this.data.userInput.id.length != 6){
      wx.showModal({
        title:"哎呀，出错误了>.<",
        content:"需要输入身份证后六位哦",
        showCancel:false,
        success(res){}
      })
    }
    else{
      app.globalData.userInput = this.data.userInput;
      wx.navigateTo({
        url: '/pages/stuInfoDetail/stuInfoDetail',
      })
    }
 
  },

  // 获得用户输入的姓名
  getName(e){
    this.data.userInput.name_examNumber = e.detail.value;
  },  
  getId(e){
    this.data.userInput.id = e.detail.value;
  },
  getPhoneNumber(e){
    this.data.userInput.phoneNumber = e.detail.value;
  },
  getQQ(e){
    this.data.userInput.QQ = e.detail.value;
  },
  getWeChat(e){
    this.data.userInput.WeChat = e.detail.value;
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
    // console.log(app.globalData.userAvater);
    this.setData({
      avatarUrl:app.globalData.userAvater,
      nickName:app.globalData.nickName
    })
    // console.log(that.data.userInfo.nickName);
  }
})