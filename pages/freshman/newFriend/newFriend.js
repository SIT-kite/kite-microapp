// pages/newFriend/newFriend.js
var app = getApp();
import { handlerGohomeClick, handlerGobackClick } from '../../../utils/navBarUtils'
var util = require("../../../utils/utils.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roommates: null,
    familiar: null,
    isHidden: false
  },
  // navBar handler
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick,

  // 用于初始化页面数据
  pageDataInit: function () {
    var that = this;
    if (app.globalData.roommates == null) {
      wx.showLoading({
        title: '加载中',
        mask: true,
        success: (result) => {

        },
        fail: () => { },
        complete: () => { }
      });
      // 获取室友信息
      wx.request({
        url: `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}/roommate`,
        method: "GET",
        data: {
          "secret": `${app.globalData.userInfo.secret}`
        },
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${app.globalData.token}`,
        },
        success(res) {
          if (res.data.code == 0) {
            console.log("roomate 获取成功");
            that.data.roommates = res.data.data.roommates;
            for (var i = 0; i < that.data.roommates.length; i++) {
              that.data.roommates[i].lastSeen = util.getIntervalToCurrentTime(that.data.roommates[i].lastSeen);
              that.data.roommates[i].isHidden = {
                "qq": null,
                "wechat": null
              }
              if (that.data.roommates[i].contact == null) {
                that.data.roommates[i].isHidden.qq = true;
                that.data.roommates[i].isHidden.wechat = true;
              }
              else {
                that.data.roommates[i].isHidden.qq = that.data.roommates[i].contact.qq == "" ? true : false;
                that.data.roommates[i].isHidden.wechat = that.data.roommates[i].contact.wechat == "" ? true : false;
              }
            }

            // 获取可能认识的人
            if (app.globalData.visible) {
              wx.request({
                url: `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}/familiar`,
                method: "GET",
                data: {
                  "secret": `${app.globalData.userInfo.secret}`
                },
                header: {
                  "content-type": "application/x-www-form-urlencoded",
                  "Authorization": `Bearer ${app.globalData.token}`,
                },
                success(res) {
                  console.log(res.data);
                  console.log("familiar 获取成功");
                  if (res.data.code == 0) {
                    var familiarList = res.data.data.people_familiar;
                    for (var i = 0; i < familiarList.length; i++) {
                      familiarList[i].genderImage = familiarList[i].gender == "M" ? "/asset/pic/boy.png" : "/asset/pic/girl.png";
                      familiarList[i].lastSeen = util.getIntervalToCurrentTime(familiarList[i].lastSeen);
                      familiarList[i].isHidden = {
                        qq: null,
                        wechat: null,
                        padding: null
                      }
                      if (familiarList[i].contact == null) {
                        familiarList[i].isHidden.qq = true;
                        familiarList[i].isHidden.wechat = true;
                      }
                      else {
                        familiarList[i].isHidden.qq = familiarList[i].contact.qq == "" ? true : false;
                        familiarList[i].isHidden.wechat = familiarList[i].contact.wechat == "" ? true : false;
                        familiarList[i].isHidden.padding = familiarList[i].isHidden.wechat == true ? 25 : 0;
                      }
                    }
                    that.setData({
                      familiar: familiarList,
                      roommates: that.data.roommates,
                      isHidden: false
                    });
                    app.globalData.roommates = that.data.roommates;
                    app.globalData.familiar = that.data.familiar;
                    wx.hideLoading();
                  }
                  else {
                    wx.showModal({
                      title: "哎呀，出错误了>.<",
                      content: res.data,
                      showCancel: false,
                      success(res) { }
                    })
                  }
                },
                fail(res) {
                  wx.showModal({
                    title: "哎呀，出错误了>.<",
                    content: "网络不在状态",
                    showCancel: false,
                    success(res) { }
                  })
                },
                complete: () => { wx.hideLoading(); }
              })
            }
            // 不用获取可能认识的人
            else {
              that.setData({
                roommates: that.data.roommates,
                isHidden: true
              })
              app.globalData.roommates = that.data.roommates;
              wx.hideLoading();

            }
          } else {
            wx.showModal({
              title: "哎呀，出错误了>.<",
              content: res.data,
              showCancel: false,
              success(res) { }
            })
          }
        },
        fail(res) {
          wx.showModal({
            title: "哎呀，出错误了>.<",
            content: "网络不在状态",
            showCancel: false,
            success(res) { }
          });
        },
        complete: () => { },
      })
    }
    // 本地有可能认识人和室友的信息
    else {
      console.log("本地已有信息！");
      if (app.globalData.visible) {
        that.setData({
          roommates: app.globalData.roommates,
          familiar: app.globalData.familiar,
          isHidden: false
        })
      }
      else {
        that.setData({
          roommates: app.globalData.roommates,
          isHidden: true
        })
      }

    }
  },
  pageDataFresh: function () {
    var that = this;
    // 请求roommate数据
    var reqTask = wx.request({
      url: `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}/roommate`,
      method: "GET",
      data: {
        "secret": `${app.globalData.userInfo.secret}`
      },
      header: {
        "content-type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${app.globalData.token}`,
      },
      success: (res) => {
        if (res.data.code == 0) {
          //  roommate请求成功
          var roommatesList = res.data.data.roommates;
          for (var i = 0; i < roommatesList.length; i++) {
            roommatesList[i].lastSeen = util.getIntervalToCurrentTime(roommatesList[i].lastSeen);
            roommatesList[i].isHidden = {
              qq: null,
              wechat: null
            }
            if (roommatesList[i].contact == null) {
              roommatesList[i].isHidden.qq = true;
              roommatesList[i].isHidden.wechat = true;
            }
            else {
              roommatesList[i].isHidden.qq = roommatesList[i].contact.qq == "" ? true : false;
              roommatesList[i].isHidden.wechat = roommatesList[i].contact.wechat == "" ? true : false;
            }
          }
          app.globalData.roommates = roommatesList;

          // 发送famliar请求
          var reqTask = wx.request({
            url: `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}/familiar`,
            method: "GET",
            data: {
              "secret": `${app.globalData.userInfo.secret}`
            },
            header: {
              "content-type": "application/x-www-form-urlencoded",
              "Authorization": `Bearer ${app.globalData.token}`,
            },
            success: (res) => {
              if (res.data.code == 0) {
                // familiar获取成功
                var familiarList = res.data.data.people_familiar;
                for (var i = 0; i < familiarList.length; i++) {
                  familiarList[i].genderImage = familiarList[i].gender == "M" ? "/asset/pic/boy.png" : "/asset/pic/girl.png";
                  familiarList[i].lastSeen = util.getIntervalToCurrentTime(familiarList[i].lastSeen);
                  familiarList[i].isHidden = {
                    qq: null,
                    wechat: null,
                    padding: null
                  }
                  if (familiarList[i].contact == null) {
                    familiarList[i].isHidden.qq = true;
                    familiarList[i].isHidden.wechat = true;
                  }
                  else {
                    familiarList[i].isHidden.qq = familiarList[i].contact.qq == "" ? true : false;
                    familiarList[i].isHidden.wechat = familiarList[i].contact.wechat == "" ? true : false;
                    familiarList[i].isHidden.padding = familiarList[i].isHidden.wechat == true ? 25 : 0;
                  }
                }
                //只设置全局变量familiar 
                app.globalData.familiar = familiarList;


              } else {
                // familar获取失败
                wx.showModal({
                  title: "哎呀，出错误了>.<",
                  content: "网络不在状态",
                  showCancel: false,
                });
              }
            },
            fail: () => { },
            complete: () => {
              // 请求同时成功 刷新页面
              that.onLoad();
              that.onShow();
            }
          });
          // 设置全局变量roommates

        } else {
          // roommate请求失败
          wx.showModal({
            title: "哎呀，出错误了>.<",
            content: "网络不在状态",
            showCancel: false,
          });
        }

      },
      fail: () => { },
      complete: () => { }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("页面 newFriend onLoad...");
    this.pageDataInit();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.stopPullDownRefresh();
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
    console.log("页面 newClass 刷新中...")
    this.pageDataFresh();
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