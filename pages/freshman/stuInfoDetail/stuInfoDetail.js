//index.js
//获取应用实例
import {handlerGohomeClick,handlerGobackClick} from '../../../utils/navBarUtils'
var app = getApp()
Page({
  data: {
    pageReady: false,
    userDetail:null,
    motto: 'Hey!',
    avatarUrl:"",
    nickName:"",
  },
  // 导航栏handler函数
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick,
  pageDataInit: function(){
    var that = this;
    // 如果本地没有此信息，则是第一次加载

      // 获取用户的详细信息
      console.log("发送请求获取用户信息中");
      wx.showLoading({
        title: '加载中',
        mask: true,
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
      wx.request({
        url: `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}`,
        method:"GET",
        data:{
          "secret": `${app.globalData.userInfo.secret}`
        },
        header:{
          "content-type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${app.globalData.token}`,
        },
        success(res){
          if (res.data.code == 0){
            // 同时更新 Storage 和 globalData
            app.globalData.userDetail = res.data.data;
            wx.setStorageSync("userDetail", res.data.data);
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
        },
        complete:()=>{
          wx.hideLoading();
        }
      });
      // 页面赋值
      this.setData({
        userDetail:app.globalData.userDetail,
        avatarUrl:app.globalData.userAvatar,
        nickName:app.globalData.nickName
      });
  },

  gotoAnalysis: function(){
    wx.navigateTo({
      url: '/pages/freshman/shareAnalysis/shareAnalysis',
      success: (result)=>{
        console.log("跳转分享页面成功")
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  gotoModify(e){
    console.log("gotoModify");
    wx.navigateTo({
      url: '/pages/freshman/inputInfo/inputInfo?isHidden=none',
    })
  },

  gotoNewFriend(e){
    console.log("gotoNewFriend");
    wx.navigateTo({
      url: '/pages/freshman/newFriend/newFriend',
    })
  },

  gotoClass(e){
    console.log("gotoNewClass");
    wx.navigateTo({
      url: '/pages/freshman/newClass/newClass',
    })
  },

  onLoad: function () {
    this.data.pageReady = false;
    console.log('页面 stuInfoDetail onLoad...');
    this.pageDataInit();
    
  },
  onShow: function(){
    console.log("页面 stuInfoDetail onShow...");
    this.pageDataInit();

  },
  onReady: function(){
    console.log("页面 stuInfoDetail onReady!");
    this.setData({
      pageReady:true
    });
  }

})