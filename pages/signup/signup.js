// pages/signup/signup.js
import { handlerGohomeClick, handlerGobackClick } from '../../utils/navBarUtils'
const app = getApp();
const commonUrl = app.globalData.commonUrl;
const requestUtils = require("../../utils/requestUtils");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    testInfo: "",
    show: false,
    resInfo: null,
    upSuccess: false,
    canupLoad: false,
    uploadInfo: {
      realName: null,
      studentId: null
    }
  },

  // navBar按钮函数
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick,

  bindName: function (e) {
    const that = this;
    this.setData({
      'uploadInfo.realName': e.detail.value
    })
    this.setData({
      canupLoad: Boolean(that.data.uploadInfo.realName &&
        that.data.uploadInfo.studentId &&
        (that.data.uploadInfo.oaSecret ||
          that.data.uploadInfo.identityNumber))
    })
  },
  bindId: function (e) {
    const that = this;
    this.setData({
      'uploadInfo.studentId': e.detail.value
    })
    this.setData({
      canupLoad: Boolean(that.data.uploadInfo.realName &&
        that.data.uploadInfo.studentId &&
        (that.data.uploadInfo.oaSecret ||
          that.data.uploadInfo.identityNumber))
    })
  },
  bindSecret: function (e) {
    const that = this;
    this.setData({
      'uploadInfo.oaSecret': e.detail.value
    })
    this.setData({
      canupLoad: Boolean(that.data.uploadInfo.realName &&
        that.data.uploadInfo.studentId &&
        (that.data.uploadInfo.oaSecret ||
          that.data.uploadInfo.identityNumber))
    })

  },
  bindidentity: function (e) {
    const that = this;
    this.setData({
      'uploadInfo.identityNumber': e.detail.value.toString().toUpperCase() 
    })
    this.setData({
      canupLoad: Boolean(that.data.uploadInfo.realName &&
        that.data.uploadInfo.studentId &&
        (that.data.uploadInfo.oaSecret ||
          that.data.uploadInfo.identityNumber))
    })
  },
  onClose: function () {
    this.setData({
      show: false
    })
  },
  signup: function () {
    const that = this;
    var test = "";
    for (let i in that.data.uploadInfo) {
      if (that.data.uploadInfo[i] === "") delete (that.data.uploadInfo[i])
    }
    that.setData({
      uploadInfo: that.data.uploadInfo
    });
    wx.setStorage({
      data: this.data.uploadInfo,
      key: 'uploadInfo',
    });
    let url = `${commonUrl}/user/${app.globalData.uid}/identity`;
    let data = that.data.uploadInfo;
    let header =  {
      "content-type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${app.globalData.token}`
    };
    var postUserIdentity = requestUtils.doPOST(url, data, header);
    postUserIdentity.then(res => {
      that.setData({
        resInfo: "认证成功！",
        upSuccess: true
      });
      app.globalData.isStudent = true;
      // 更新本地数据
      wx.setStorageSync("isStudent", true);
      setTimeout(() => {
        that.setData({
          show: false
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          });
        }, 500);
      }, 500);
      that.setData({
        show: true
      });
    }).catch(res => {
      if (res.error == requestUtils.NETWORK_ERROR) {
        that.setData({
          upSuccess: false,
          resInfo: "网络问题，请稍后再试",
        });
        that.setData({
          show: true
        });
        setTimeout(() => {
          that.setData({
            show: false
          })
        }, 500);
      }
      if (res.error == requestUtils.REQUEST_ERROR) {
        that.setData({
          resInfo: res.data.msg,
          upSuccess: false
        });
        that.setData({
          show: true
        });
      }
    });
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    if (app.globalData.signPrivacyConfirm != true) {
      wx.showModal({
        title: '隐私信息提示',
        content: `小程序部分功能(如闲置交易，课程表)需要验证并使用您的身份信息以提供功能或保证交易安全。数据仅用于比对身份信息且保存期限为7天`,
        showCancel: true,
        cancelText: '我拒绝',
        cancelColor: '#000000',
        confirmText: '我已知晓',
        confirmColor: '#4B6DE9',
        success: (result) => {
          if(!result.confirm){
            that.handlerGobackClick();
          }else{
            app.globalData.signPrivacyConfirm = true;
            wx.setStorageSync("signPrivacyConfirm", true);
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;
    wx.getStorage({
      key: 'uploadInfo',
      success(res) {
        console.log(res)
        that.setData({
          uploadInfo: res.data
        })
        that.setData({
          canupLoad: Boolean(that.data.uploadInfo.realName &&
            that.data.uploadInfo.studentId &&
            (that.data.uploadInfo.oaSecret ||
              that.data.uploadInfo.identityNumber))
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})