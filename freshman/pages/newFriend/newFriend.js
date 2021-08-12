// freshman/pages/newFriend/newFriend.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import copyText   from "../../../utils/copyText.js";
import catchError from "../../../utils/requestUtils.catchError";
import getHeader  from "../../../utils/getHeader";

const utlls = "../../../utils/";
const timeUtils = require(utlls + "timeUtils");
const requestUtils = require(utlls + "requestUtils");

const app = getApp();

Page({

  data: {
    roommates: null,
    familiar: null,
    isHidden: false,
    show: false,
  },

  // navBar handler
  handlerGohomeClick,
  handlerGobackClick,

  copyText,

  getPageData() {

    wx.showLoading({
      title: "加载中",
      mask: true
    });

    let promiseList = [];

    let url = `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}/roommate`;
    let data = { "secret": `${app.globalData.userInfo.secret}` };
    let header = getHeader("urlencoded", app.globalData.token);

    // 获取室友信息
    var getRoommates = requestUtils.doGET(url, data, header).then(res => {
      var roommatesList = res.data.data.roommates;
      roommatesList.forEach(roommate => {
        roommate.lastSeen = timeUtils.getIntervalToCurrentTime(roommate.lastSeen);
        roommate.isHidden = {
          "qq": null,
          "wechat": null
        }
        if (roommate.contact === null) {
          roommate.isHidden.qq = true;
          roommate.isHidden.wechat = true;
        } else {
          roommate.isHidden.qq = roommate.contact.qq === "";
          roommate.isHidden.wechat = roommate.contact.wechat === "";
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
      data = { "secret": `${app.globalData.userInfo.secret}` };
      header = getHeader("urlencoded", app.globalData.token);

      var getFamilies = requestUtils.doGET(url, data, header).then(res => {
        var familiarList = res.data.data.people_familiar;
        familiarList.forEach(familiar => {
          familiar.genderImage =
            familiar.gender === "M"
            ? "/freshman/assets/male.png"
            : "/freshman/assets/female.png";
          familiar.lastSeen = timeUtils.getIntervalToCurrentTime(familiar.lastSeen);
          familiar.isHidden = {
            qq: null,
            wechat: null,
            padding: null
          }
          if (familiar.contact === null) {
            familiar.isHidden.qq = true;
            familiar.isHidden.wechat = true;
          } else {
            familiar.isHidden.qq = familiar.contact.qq === "" ;
            familiar.isHidden.wechat = familiar.contact.wechat === "";
            familiar.isHidden.padding = familiar.isHidden.wechat === true ? 25 : 0;
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
    Promise.all(promiseList)
      .then(() => this.setData({ show: true }))
      .catch(catchError)
      .finally( () => wx.hideLoading() );
  },

  // 初始化页面数据
  pageDataInit() {

    if (app.globalData.roommates === null) {
      // 本地没有缓存的信息
      this.getPageData();
    } else {
      // 本地有可能认识人和室友的信息
      if (app.globalData.userDetail.visible) {
        this.setData({
          roommates: app.globalData.familiar,
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

  pageDataFresh() {
    this.getPageData();
    this.onLoad();
    this.onShow();
  },

  onLoad() {
    console.log("页面 newFriend onLoad...");
    this.setData({ show: false });
    this.pageDataInit();
  },

  // onReady() {},

  onShow() {
    wx.stopPullDownRefresh();
  },

  onPullDownRefresh() {
    this.pageDataFresh();
  },

  onShareAppMessage: () => ({
    title: "上应小风筝",
    path: "pages/index/index"
  })

})
