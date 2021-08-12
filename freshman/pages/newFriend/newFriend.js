// freshman/pages/newFriend/newFriend.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import copyText   from "../../../utils/copyText.js";
import catchError from "../../../utils/requestUtils.catchError";
import getHeader  from "../../../utils/getHeader";
import onShareAppMessage from "../../js/onShareAppMessage";

const utlls = "../../../utils/";
const timeUtils = require(utlls + "timeUtils");
const requestUtils = require(utlls + "requestUtils");

const app = getApp();
const gData = app.globalData;

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
  onShareAppMessage,
  copyText,

  getPageData() {

    wx.showLoading({ title: "正在加载…", mask: true });

    const promiseList = [];

    let url = `${gData.apiUrl}/freshman/${gData.userInfo.account}/roommate`;
    let data = { "secret": `${gData.userInfo.secret}` };
    let header = getHeader("urlencoded", gData.token);

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
      gData.roommates = roommatesList;
      return res;
    });

    promiseList.push(getRoommates);

    // 可能认识的人
    if (gData.userDetail.visible) {

      url = `${gData.apiUrl}/freshman/${gData.userInfo.account}/familiar`;
      data = { "secret": `${gData.userInfo.secret}` };
      header = getHeader("urlencoded", gData.token);

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
        gData.familiar = familiarList;
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

    if (gData.roommates === null) {
      // 本地没有缓存的信息
      this.getPageData();
    } else {
      // 本地有可能认识人和室友的信息
      if (gData.userDetail.visible) {
        this.setData({
          roommates: gData.roommates,
          familiar: gData.familiar,
          isHidden: false
        });
      } else {
        this.setData({
          roommates: gData.roommates,
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
  }

})
