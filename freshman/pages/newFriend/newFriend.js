// freshman/pages/newFriend/newFriend.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import catchError from "../../../utils/requestUtils.catchError";
import getHeader  from "../../../utils/getHeader";
import onShareAppMessage from "../../js/onShareAppMessage";
import request from "../../../utils/request";

const utlls = "../../../utils/";
const timeUtils = require(utlls + "timeUtils");

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

  copy(e) {
    const dataset = e.target.dataset;
    wx.setClipboardData({
      data: dataset.text,
      success: () => wx.showToast({
        title: `复制${dataset.type}成功`
      })
    });
  },

  getPageData() {

    wx.showLoading({ title: "正在加载…", mask: true });

    const { account, secret } = gData.userInfo;

    const promiseList = [];

    // 获取室友信息
    var getRoommates = request({
      url: `${gData.apiUrl}/freshman/${account}/roommate`,
      header: getHeader("urlencoded", gData.token),
      data: { "secret": `${secret}` }
    }).then(res => {
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
      return res;
    });

    promiseList.push(getRoommates);

    // 可能认识的人
    if (gData.userDetail.visible) {
      const getFamilies = request({
        url: `${gData.apiUrl}/freshman/${account}/familiar`,
        header: getHeader("urlencoded", gData.token),
        data: { "secret": `${secret}` }
      }).then(res => {
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
            familiar.isHidden.qq = familiar.contact.qq === "";
            familiar.isHidden.wechat = familiar.contact.wechat === "";
            familiar.isHidden.padding = familiar.isHidden.wechat === true ? 25 : 0;
          }
        });

        this.setData({
          familiar: familiarList,
          isHidden: false
        });
      });

      promiseList.push(getFamilies);

    }

    // 等待所有进程结束
    Promise[(() => {
      if ("allSettled" in Promise) {
        return "allSettled";
      } else {
        console.warn("当前运行环境不支持 Promise.allSettled()，改用 Promise.all()");
        return "all";
      }
    })()](promiseList)
      .then(() => this.setData({ show: true }))
      .catch(catchError)
      .finally( () => wx.hideLoading() );
  },

  onLoad() {
    wx.showLoading({ title: "正在加载…", mask: true });
    this.getPageData();
    wx.hideLoading();
  },

  // onReady() {},

  onShow() {
    wx.stopPullDownRefresh();
  },

  onPullDownRefresh() {
    wx.showLoading({ title: "正在刷新…" });
    this.getPageData();
    wx.hideLoading();
    wx.stopPullDownRefresh();
  }

})
