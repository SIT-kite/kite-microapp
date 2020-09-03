//index.js
//获取应用实例
import {handlerGohomeClick,handlerGobackClick} from '../../../utils/navBarUtils'
var app = getApp()
Page({
  data: {
    promptText:"",
    buttonText:"",
    isHidden:"flex",
    motto: 'Hey!',
    avatarUrl:"",
    nickName:"",
    userInfo:{
      name_examNumber:"",
      id:""
    },
    contact:{
      tel:"",
      qq:"",
      wechat:""
    },
    visible:true
  },
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick,

  checkBoxChange (e){
    var that = this;
    console.log(e.detail.value);
    // 取消勾选
    if (e.detail.value[0] == undefined){
      wx.showModal({
        title:"取消勾选",
        content:"我们将不会给您推送可能认识的人,并且不会将您推送给他人（同城，同乡..）",
        showCancel:false,
        success(res){
          that.data.visible = false;
          // console.log(app.globalData.visible);
        }
      })
    }
    // 勾选
    else{
      wx.showModal({ 
        title:"勾选",
        content:"我们将给您推送可能认识的人，包括将您推送给他人（同城，同乡..）",
        showCancel:false,
        success(res){
          that.data.visible = true;
          // console.log(app.globalData.visible);
        }
      })

    }
  },

  gotoStuInfoDetail(e){
    var that = this;
    console.log("gotoStuInfoDetail");
    console.log(JSON.stringify(that.data.contact));
    // 没有隐藏输入框（第一次输入）
    if (this.data.isHidden == "flex"){
      if (this.data.userInfo.name_examNumber == ""){
        wx.showModal({
          title:"哎呀，出错误了>.<",
          content:"请输入姓名/考生号/准考证号其中的一个",
          showCancel:false,
          success(res){}
        })
      }
      else if(this.data.userInfo.id.length != 6 || this.data.userInfo.id == ""){
        wx.showModal({
          title:"哎呀，出错误了>.<",
          content:"需要输入身份证后六位哦",
          showCancel:false,
          success(res){}
        })
      }
      else{
        wx.request({
          url: `${app.globalData.commonUrl}/freshman/${that.data.userInfo.name_examNumber}`,
          method:"PUT",
          data:{
            "secret": `${that.data.userInfo.id}`,
            "contact":JSON.stringify(that.data.contact),
            "visible":that.data.visible
          },
          header:{
            "content-type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${app.globalData.token}`,
          },
          success(res){
            console.log(res.data);
            if (res.data.code == 0){
              // 本地保留一份
              console.log(that.data.visible);
              app.globalData.visible = that.data.visible;
              app.globalData.userInfo = that.data.userInfo;
              app.globalData.contact = that.data.contact;
              wx.redirectTo({
                url: '/pages/freshman/stuInfoDetail/stuInfoDetail',
              })
            }
            else if (res.data.code == 120){
              wx.showModal({
                title:"哎呀，出错误了>.<",
                content:"查询不到该用户的信息",
                showCancel:false,
                success(res){}
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
    //  修改
    else{
      console.log("modify request");
      // console.log(this.data.userInfo);
      // console.log(this.data.visible);
      // console.log(this.data.contact);
      wx.request({
        url: `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.name_examNumber}`,
        method:"PUT",
        data:{
          "secret": `${app.globalData.userInfo.id}`,
          "contact":JSON.stringify(that.data.contact),
          "visible":that.data.visible
        },
        header:{
          "content-type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${app.globalData.token}`,
        },
        success(res){
          console.log(res.data);
          // 本地同样保留一份
          app.globalData.visible = that.data.visible;
          app.globalData.contact = that.data.contact;
          if (res.data.code == 0){
            wx.navigateBack({
              url: '/pages/stuInfoDetail/stuInfoDetail',
              delta:1
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
  },

  // 获得用户输入的姓名
  getName(e){
    // console.log(e.detail.value);
    this.data.userInfo.name_examNumber = e.detail.value;
  },  
  getId(e){
    this.data.userInfo.id = e.detail.value;
  },
  getPhoneNumber(e){
    this.data.contact.tel = e.detail.value;
  },
  getqq(e){
    // console.log(e.detail.value);
    this.data.contact.qq = e.detail.value;
  },
  getwechat(e){
    this.data.contact.wechat = e.detail.value;
  },


  onLoad: function (option) {
    console.log(option.isHidden);
    console.log('onLoad');
    var that = this;
    console.log(that.data.userInfo);
    // 如果为none，说明现在执行修改功能，需要把全局变量中的contact拷贝一份,展示在input框中
    if (option.isHidden == "none"){
      this.setData({
        contact:app.globalData.contact,
        userInfo:app.globalData.userInfo,
        visible:app.globalData.visible,
        promptText:option.isHidden == "flex"?"请完善一下信息吧:":"请在下方输入要修改的信息:",
        buttonText:option.isHidden == "flex"?"开启大学生活第一站":"确定",
        isHidden:option.isHidden,
        avatarUrl:app.globalData.userAvatar,
        nickName:app.globalData.nickName
      })
      console.log(that.data.visible);
    }
    else{
      this.setData({
        promptText:option.isHidden == "flex"?"请完善一下信息吧:":"请在下方输入要修改的信息:",
        buttonText:option.isHidden == "flex"?"开启大学生活第一站":"确定",
        isHidden:option.isHidden,
        avatarUrl:app.globalData.userAvatar,
        nickName:app.globalData.nickName
      })
    }
    // console.log(that.data.userInfo);
    // console.log(that.data.contact);
    // console.log(that.data.visible);
    console.log("inputInfo onload over")
  }
})