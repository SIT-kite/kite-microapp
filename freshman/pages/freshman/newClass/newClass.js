// pages/newClass/newClass.js
import { handlerGohomeClick, handlerGobackClick } from "../../../../utils/navBarUtils";
import copyText from "../../../../utils/copyText";
import catchError from "../../../../utils/requestUtils.catchError";

const utlls = "../../../../utils/";
const timeUtils = require(utlls + "timeUtils");
const requestUtils = require(utlls + "requestUtils");

const app = getApp();

Page({

  data: {
    classmates: null,
    show: false
  },

  handlerGohomeClick,
  handlerGobackClick,

  copyText,

  // 初始化页面 classmates 数据
  pageDataInit: function () {

    let url = "";
    let data = {};
    let header = {};

    if (app.globalData.classmates == null) {
      // 判断全局是否包含 classmates 数据
      console.log("请求远程 classmates 数据");
      wx.showLoading({
        title: '加载中',
        mask: true
      });

      url = `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}/classmate`;
      data = {
        "secret": `${app.globalData.userInfo.secret}`
      };
      header = {
        "content-type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${app.globalData.token}`,
      };
      var getClassmates = requestUtils.doGET(url, data, header).then(res => {
        var stuList = res.data.data.classmates;
        stuList.forEach(student => {

          student.genderImage = "/asset/icon/" + (
            student.gender === "M"
            ? "male.png"
            : "female.png"
          );
          student.lastSeen = timeUtils.getIntervalToCurrentTime(student.lastSeen);
          student.isHidden = {
            "qq": null,
            "wechat": null,
            "padding": null
          }

          if (student.contact == null) {
            student.isHidden.qq = true;
            student.isHidden.wechat = true;
          }
          else {
            student.isHidden.qq = student.contact.qq === "";
            student.isHidden.wechat = student.contact.wechat === "";
            student.isHidden.padding = student.isHidden.wechat === true ? 25 : 0;
          }
        });
        app.globalData.classmates = res.data.data.classmates;
        this.setData({ classmates: stuList });
        wx.hideLoading();
        return res;
      });

      getClassmates.then(
        () => console.log("请求加载完成")
      ).catch(catchError);

      // 阻塞页面渲染
      Promise.all([getClassmates]).then(() => {
        console.log("数据加载完成");
        this.setData({show: true})
      });
    } else {
      console.log("加载本地 classmates 数据");
      this.setData({
        classmates: app.globalData.classmates,
        show: true
      });
    }
  },

  /**
   * 页面数据刷新
   */
  pageDataFresh: function () {
    this.setData({show: false});
    let url = "";
    let data = {};
    let header = {};

    url = `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}/classmate`;
    data = {
      "secret": `${app.globalData.userInfo.secret}`
    };
    header = {
      "content-type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${app.globalData.token}`,
    };

    var refleshClassmates = requestUtils.doGET(url, data, header).then(res => {
      var stuList = res.data.data.classmates;
      stuList.forEach(student => {
        student.genderImage = student.gender === "M" ? "/asset/icon/male.png" : "/asset/icon/female.png";
        student.lastSeen = timeUtils.getIntervalToCurrentTime(student.lastSeen);
        student.isHidden = {
          "qq": null,
          "wechat": null,
          "padding": null
        }
        if (student.contact == null) {
          student.isHidden.qq = true;
          student.isHidden.wechat = true;
        }
        else {
          student.isHidden.qq = student.contact.qq === "";
          student.isHidden.wechat = student.contact.wechat === "";
          student.isHidden.padding = student.isHidden.wechat === true ? 25 : 0;
        }
      });
      app.globalData.classmates = res.data.data.classmates;
      this.setData({
        classmates: stuList
      });
      wx.hideLoading();
      return res;
    });
    refleshClassmates.then(() => {
      // 关闭刷新动画
      this.setData({show: true});
      this.onShow();
    }).catch(catchError);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log("页面 newClass onLoad...");
    this.setData({show: false});
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
    console.log("页面 newClass 刷新中");
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
    return {
      title: "上应小风筝",
      path: "pages/index/index"
    }
  }
})
