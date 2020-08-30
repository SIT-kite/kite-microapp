
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    promptText:"",
    token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc19hZG1pbiI6dHJ1ZSwidWlkIjoxMH0.tY2adWTqpK21lqquSbxYLT3Zvwn83q8K0U0J59oeeFM",
    buttonText:"",
    isHidden:false,
    motto: 'Hey!',
    avatarUrl:"",
    nickName:"",
    userInput:{
      name_examNumber:"",
      id:"",
      contact:{
        phoneNumber:"",
        qq:"",
        wechat:""
      }
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
    var that = this;
    console.log(123);
    // console.log(JSON.parse(that.data.userInput.contact));
    console.log(JSON.stringify(that.data.userInput.contact));
    // 没有隐藏输入框（第一次输入）
    if (!this.data.isHidden){
      if (this.data.userInput.id.length != 6){
        wx.showModal({
          title:"哎呀，出错误了>.<",
          content:"需要输入身份证后六位哦",
          showCancel:false,
          success(res){}
        })
      }
      else{
        console.log(123);
        app.globalData.userInput = this.data.userInput;
        wx.request({
          url: `${app.globalData.commonUrl}/freshman/${app.globalData.userInput.name_examNumber}`,
          method:"PUT",
          data:{
            "secret": `${app.globalData.userInput.id}`,
            "contact":JSON.stringify(that.data.userInput.contact)
          },
          header:{
            "content-type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${that.data.token}`,
          },
          success(res){
            console.log(res.data);
          }
        })
        wx.navigateTo({
          url: '/pages/stuInfoDetail/stuInfoDetail',
        })
      }
    }
    //  修改
    else{
      wx.request({
        url: `${app.globalData.commonUrl}/freshman/${app.globalData.userInput.name_examNumber}`,
        method:"PUT",
        data:{
          "secret": `${app.globalData.userInput.id}`,
          "contact":JSON.stringify(that.data.userInput.contact)
        },
        header:{
          "content-type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${that.data.token}`,
        },
        success(res){
          console.log(res.data);
        }
      })
      wx.navigateBack({
        delta: 1,
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
    this.data.userInput.contact.phoneNumber = e.detail.value;
  },
  getqq(e){
    this.data.userInput.contact.qq = e.detail.value;
  },
  getwechat(e){
    this.data.userInput.contact.wechat = e.detail.value;
  },


  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (option) {
    console.log(option.isHidden);
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
      promptText:option.isHidden?"请在下方输入要修改的信息:":"请完善一下信息吧:",
      buttonText:option.isHidden?"确定":"开启大学生活第一站",
      isHidden:option.isHidden,
      avatarUrl:app.globalData.userAvater,
      nickName:app.globalData.nickName
    })
    // console.log(that.data.userInfo.nickName);
  }
})