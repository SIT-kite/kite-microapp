//index.js
//获取应用实例
import {handlerGohomeClick,handlerGobackClick} from '../../../utils/navBarUtils'
var app = getApp()
const secretRex = /[0-9]{5}[0-9X]/;
Page({
  data: {
    promptText:"",
    buttonText:"",
    isHidden:"flex",
    motto: 'Hey!',
    avatarUrl:"",
    nickName:"",
    userInfo:{
      account:"",
      secret:""
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
          console.log(that.data.visible);
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
          console.log(that.data.visible);
        }
      })

    }
  },

  gotoStuInfoDetail(e){
    var that = this;
    console.log("gotoStuInfoDetail");
    console.log(JSON.stringify(that.data.contact));
    // 没有隐藏输入框（第一次输入个人信息）
    if (this.data.isHidden == "flex"){
      if (this.data.userInfo.account == ""){
        // 账号未填写
        wx.showModal({
          title:"哎呀，出错误了>.<",
          content:"请输入姓名/考生号/准考证号其中的一个",
          showCancel:false,
          success(res){}
        })
      }
      // else if(this.data.userInfo.secret.length != 6 || this.data.userInfo.secret == ""){
      else if(!secretRex.test(this.data.userInfo.secret)){
        // secret不符合格式
        wx.showModal({
          title:"哎呀，出错误了>.<",
          content:"需要输入身份证后六位哦",
          showCancel:false,
          success(res){}
        })
      }
      else{
        // 满足输入框要求 发送PUT请求
        wx.request({
          url: `${app.globalData.commonUrl}/freshman/${that.data.userInfo.account}`,
          method:"PUT",
          data:{
            "secret": `${that.data.userInfo.secret}`,
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
              // 本地Storage存储一份
              wx.setStorageSync("userInfo",that.data.userInfo);
              // 全局同时更新
              app.globalData.visible = that.data.visible;
              app.globalData.userInfo = that.data.userInfo;
              app.globalData.contact = that.data.contact;
              wx.navigateTo({
                url: '/pages/freshman/stuInfoDetail/stuInfoDetail',
                success: (result)=>{
                  console.log("跳转 stuInfoDetail 页面成功")
                },
                fail: ()=>{},
                complete: ()=>{}
              });
            }
            else if (res.data.code == 120){
              // 返回数据错误码 120
              wx.showModal({
                title:"哎呀，出错误了>.<",
                content:"查询不到该用户的信息",
                showCancel:false,
                success(res){}
              })
            }
            else{
              // 其他数据错误码的所有情况
              wx.showModal({
                title:"哎呀，出错误了>.<",
                content:res.data,
                showCancel:false,
                success(res){}
              })
            }
          },
          fail(res){
            // PUT请求失败
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
    //  非第一次进入 修改信息
    else{
      console.log("修改个人信息");
      wx.request({
        url: `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}`,
        method:"PUT",
        data:{
          "secret": `${app.globalData.userInfo.secret}`,
          "contact":JSON.stringify(that.data.contact),
          "visible":that.data.visible
        },
        header:{
          "content-type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${app.globalData.token}`,
        },
        success(res){
          // console.log(res.data);
          if (res.data.code == 0){
            // Storage 和 globalData 同时更新
            wx.setStorageSync("userInfo",that.data.userInfo);
            app.globalData.visible = that.data.visible;
            app.globalData.contact = that.data.contact;
            
            wx.redirectTo({
              url: '/pages/stuInfoDetail/stuInfoDetail',
              success: (result)=>{
                console.log("跳转至页面 stuInfoDetail")  
              },
              fail: ()=>{},
              complete: ()=>{}
            });
            
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
    this.setData({
      'userInfo.account': e.detail.value
    });
  },  
  getSecret(e){
    this.setData({
      'userInfo.secret': e.detail.value.toString().toUpperCase()
    })
  },
  getPhoneNumber(e){

    this.setData({
      'contact.tel': e.detail.value
    });
  },
  getqq(e){
    this.setData({
      'contact.qq': e.detail.value
    });
  },
  getwechat(e){

    this.setData({
      'contact.wechat': e.detail.value
    });
    
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
        buttonText:option.isHidden == "flex"?"提交":"确定",
        isHidden:option.isHidden,
        avatarUrl:app.globalData.userAvatar,
        nickName:app.globalData.nickName
      })
      console.log(that.data.visible);
    }
    else{
      this.setData({
        buttonText:option.isHidden == "flex"?"提交":"确定",
        isHidden:option.isHidden,
        avatarUrl:app.globalData.userAvatar,
        nickName:app.globalData.nickName
      })
    }
    // console.log(that.data.userInfo);
    // console.log(that.data.contact);
    // console.log(that.data.visible);
    console.log("inputInfo onload over")
  },
  onShareAppMessage: function (e) {
    return {
      title: "上应小风筝",
      path: "pages/index/index"
    }
  }
})