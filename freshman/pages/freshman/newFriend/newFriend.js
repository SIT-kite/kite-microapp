// pages/newFriend/newFriend.js
var app = getApp();
import {
  handlerGohomeClick,
  handlerGobackClick
} from '../../../../utils/navBarUtils'
const timeUtils = require("../../../../utils/timeUtils");
const requestUtils = require("../../../../utils/requestUtils");

const catchError = res => wx.showModal({
  title: "哎呀，出错误了 >.<",
  content: (
    res.error == requestUtils.REQUEST_ERROR ? res.data
    : res.error == requestUtils.NETWORK_ERROR ? "网络不在状态"
    : "未知错误"
  ),
  showCancel: false
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    roommates: null,
    familiar: null,
    isHidden: false,
    show: false,
  },
  // navBar handler
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick,

  /**
   * 一键复制文本
   * @param {*} e
   */
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: `复制${e.currentTarget.dataset.type}成功`
            })
          }
        })
      }
    })
  },
  // 用于初始化页面数据

  pageDataInit: function () {
    let url = "";
    let data = {};
    let header = {};
    let promiseList = [];

    if (app.globalData.roommates == null) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
      url = `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}/roommate`;
      data = {
        "secret": `${app.globalData.userInfo.secret}`
      };
      header = {
        "content-type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${app.globalData.token}`,
      };

      // 获取室友信息
      var getRoommates = requestUtils.doGET(url, data, header).then(res => {
        var roommatesList = res.data.data.roommates;
        roommatesList.forEach(roommate => {
          roommate.lastSeen = timeUtils.getIntervalToCurrentTime(roommate.lastSeen);
          roommate.isHidden = {
            "qq": null,
            "wechat": null
          }
          if (roommate.contact == null) {
            roommate.isHidden.qq = true;
            roommate.isHidden.wechat = true;
          } else {
            roommate.isHidden.qq = roommate.contact.qq == "" ? true : false;
            roommate.isHidden.wechat = roommate.contact.wechat == "" ? true : false;
          }
        });
        this.setData({
          roommates: roommatesList,
          isHidden: true
        });
        app.globalData.roommates = roommatesList;
        return res;
      });
      promiseList.push(getRoommates);


      // 可能认识的人
      if (app.globalData.userDetail.visible) {
        url = `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}/familiar`;
        data = {
          "secret": `${app.globalData.userInfo.secret}`
        },
          header = {
            "content-type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${app.globalData.token}`,
          };
        var getFamilies = requestUtils.doGET(url, data, header).then(res => {
          var familiarList = res.data.data.people_familiar;
          familiarList.forEach(familiar => {
            familiar.genderImage = familiar.gender == "M" ? "/asset/icon/male.png" : "/asset/icon/female.png";
            familiar.lastSeen = timeUtils.getIntervalToCurrentTime(familiar.lastSeen);
            familiar.isHidden = {
              qq: null,
              wechat: null,
              padding: null
            }
            if (familiar.contact == null) {
              familiar.isHidden.qq = true;
              familiar.isHidden.wechat = true;
            } else {
              familiar.isHidden.qq = familiar.contact.qq == "" ? true : false;
              familiar.isHidden.wechat = familiar.contact.wechat == "" ? true : false;
              familiar.isHidden.padding = familiar.isHidden.wechat == true ? 25 : 0;
            }
          });

          this.setData({
            familiar: familiarList,
            isHidden: false
          });
          app.globalData.familiar = familiarList;
        });
        promiseList.push(getFamilies);
      }

      // 等待所有进程结束
      Promise.all(promiseList).then(res => {
        // let [res1, res2] = res;
        console.log("请求全部完成");
        wx.hideLoading();
        this.setData({ show: true });
      }).catch(res => {
        wx.hideLoading();
        catchError(res);
      });


    } else {
      // 本地有可能认识人和室友的信息
      console.log("本地已有信息！");
      if (app.globalData.userDetail.visible) {
        this.setData({
          roommates: app.globalData.roommates,
          familiar: app.globalData.familiar,
          isHidden: false
        });
      } else {
        this.setData({
          roommates: app.globalData.roommates,
          isHidden: true
        });
      }
      this.setData({ show: true });
    }
  },

  pageDataFresh: function () {
    let url = "";
    let data = {};
    let header = {};
    let promiseList = [];
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    url = `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}/roommate`;
    data = {
      "secret": `${app.globalData.userInfo.secret}`
    };
    header = {
      "content-type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${app.globalData.token}`,
    };

    // 获取室友信息
    var getRoommates = requestUtils.doGET(url, data, header).then(res => {
      var roommatesList = res.data.data.roommates;
      roommatesList.forEach(roommate => {
        roommate.lastSeen = timeUtils.getIntervalToCurrentTime(roommate.lastSeen);
        roommate.isHidden = {
          "qq": null,
          "wechat": null
        }
        if (roommate.contact == null) {
          roommate.isHidden.qq = true;
          roommate.isHidden.wechat = true;
        } else {
          roommate.isHidden.qq = roommate.contact.qq == "" ? true : false;
          roommate.isHidden.wechat = roommate.contact.wechat == "" ? true : false;
        }
      });
      this.setData({
        roommates: roommatesList,
        isHidden: true
      });
      app.globalData.roommates = roommatesList;
      return res;
    });
    promiseList.push(getRoommates);


    // 可能认识的人
    if (app.globalData.userDetail.visible) {
      url = `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}/familiar`;
      data = {
        "secret": `${app.globalData.userInfo.secret}`
      },
        header = {
          "content-type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${app.globalData.token}`,
        };
      var getFamilies = requestUtils.doGET(url, data, header).then(res => {
        var familiarList = res.data.data.people_familiar;
        familiarList.forEach(familiar => {
          familiar.genderImage = familiar.gender == "M" ? "/asset/icon/male.png" : "/asset/icon/female.png";
          familiar.lastSeen = timeUtils.getIntervalToCurrentTime(familiar.lastSeen);
          familiar.isHidden = {
            qq: null,
            wechat: null,
            padding: null
          }
          if (familiar.contact == null) {
            familiar.isHidden.qq = true;
            familiar.isHidden.wechat = true;
          } else {
            familiar.isHidden.qq = familiar.contact.qq == "" ? true : false;
            familiar.isHidden.wechat = familiar.contact.wechat == "" ? true : false;
            familiar.isHidden.padding = familiar.isHidden.wechat == true ? 25 : 0;
          }
        });

        this.setData({
          familiar: familiarList,
          isHidden: false
        });
        app.globalData.familiar = familiarList;
      });
      promiseList.push(getFamilies);
    }

    // 等待所有进程结束
    Promise.all(promiseList).then(res => {
      let [res1, res2] = res;
      console.log("请求全部完成");
      wx.hideLoading();
      this.setData({ show: true });
    }).catch(res => {
      wx.hideLoading();
      catchError(res);
    });
    this.onLoad();
    this.onShow();
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("页面 newFriend onLoad...");
    this.setData({ show: false });
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
  onShareAppMessage: function (e) {
    return {
      title: "上应小风筝",
      path: "pages/index/index"
    }
  }
})
