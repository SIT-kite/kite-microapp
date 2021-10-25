// activity/pages/index/index.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import onShareAppMessage from "../../../utils/onShareAppMessage";
import getHeader from "../../../utils/getHeader.js";

const requestUtils = require("../../../utils/requestUtils");
const app = getApp();
const activityApiPrefix = `${app.globalData.apiUrl}/event`;
const header = getHeader("urlencoded", app.globalData.token);
const request = require("../../utils/request");
const timeUtils = require("../../../utils/timeUtils");

const CATEGORY = ['主题报告', '社会实践', '创新创业创意', '校园安全文明', '公益志愿', '校园文化', '主题教育', '易班 、社区', '安全网络教育', '论文专利', '会议']

const SCORE_MAX = [{campusCulture: 2.0,
  charity: 0.0,
  creativity: 1.5,
  safetyCivilization: 1.0,
  socialPractice: 2.0,
  themeReport: 1.5,},{campusCulture: 1.0,
    charity: 1.0,
    creativity: 1.5,
    safetyCivilization: 1.0,
    socialPractice: 2.0,
    themeReport: 1.5,}]

const INDICATOR = [[
  { name: '主题报告', max: 1.5},
  { name: '社会实践', max: 2.0},
  { name: '校园文化', max: 2.0},
  { name: '三创', max: 1.5},
  { name: '公益志愿', max: 0.0},
  { name: '安全文明', max: 1.0}
],[
  { name: '主题报告', max: 1.5},
  { name: '社会实践', max: 2.0},
  { name: '校园文化', max: 1.0},
  { name: '三创', max: 1.5},
  { name: '公益志愿', max: 1.0},
  { name: '安全文明', max: 1.0}
]]

const SUMMARY_ARRAY_INDEX = {
  themeReport: 0,
  socialPractice: 1,
  campusCulture: 2,
  creativity: 3,
  charity: 4,
  safetyCivilization: 5,
}

const SWITCH_LIST = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logined: null,
    verified: null,
    refresherTriggered: false,
    selected: '0',
    itemList: [],
    mineScoreList: [],
    CATEGORY,
    pageIndex: 1,
    showNotice: false,
    notice: "已经到底部了哦",
    option: {
      padding: 10,
      legend: {
        data: ['现有分数', '达标分数'],
        top: 5,
      },
      radar: {
        radius: "70%",
        indicator: [
            { name: '主题报告', max: 1.5},
            { name: '社会实践', max: 2.0},
            { name: '校园文化', max: 1.0},
            { name: '三创', max: 1.5},
            { name: '公益志愿', max: 1.0},
            { name: '安全文明', max: 1.0}
        ],
      },
      series: [{
          type: 'radar',
          data: [
              {
                  value: [0, 0, 0, 0, 0, 0],
                  name: '现有分数',
                  label: {
                    show: true,
                  }
              },
              {
                  value: [1.5, 2, 1, 1.5, 1, 1],
                  name: '达标分数',
                  label: {
                    show: true,
                  }
              }
          ]
      }]
    }
  },

  // 发请求获取初始活动列表
  getItemList() {
    request.fetchData(request.constructUrl('EVENT_LIST',{index:this.data.pageIndex}), "EVENT_LIST", res => {
      let list = res;
      list = this.handleProperty(list);
      this.setPageData(['itemList'], [this.data.itemList.concat(list)])
    });
  },

  // 对列表数组每一项的属性进行处理
  handleProperty(res) {
    // let list = res.data.activityList;
    // let regexp1 = /\u3010.+\u3011/g;
    // let regexp2 = /[0-9]*.+日/g;
    // let regexp3 = /日/;
    // let regexp4 = /[0-9]*.+号/g;
    // let regexp5 = /[0-9]*\u002e[0-9]*/g;
    // let regexp6 = /[0-9]*\u002e[0-9]*\u002e[0-9]*/g;
    // let regexp7 = /[0-9]*年/g;
    // list[0].startTime = "2021-12-15T00:00:00"
    res.forEach(item => {
      // item.title = item.title.replace(regexp1, "");
      // let regexp3Index = item.title.search(regexp3)
      // if(regexp3Index != -1) {
      //   if(item.title[regexp3Index + 1] != "常")
      //     item.title = item.title.replace(regexp2, "");
      // }
      // item.title = item.title.replace(regexp4, "");
      // item.title = item.title.replace(regexp5, "");
      // item.title = item.title.replace(regexp6, "");
      // item.title = item.title.replace(regexp7, "");
      item.startTime = item.startTime.replace(/-/g, "/")
      item.signEndTime = item.signEndTime.replace(/-/g, "/")
      item.src =  `../../assets/pic/category/${item.category}.png`
      let startTime = new Date(item.startTime.replace(/T/g, " "))
      let nowDate = new Date()
      if(startTime.getFullYear() === nowDate.getFullYear() && startTime.getMonth() === nowDate.getMonth() && startTime.getDate() === nowDate.getDate()) {
        item.timeInterval = "今天";
        if (new Date().getTime() > new Date(item.signEndTime.replace(/T/g, " "))) {
          item.state = '已结束';
        } else if (new Date().getTime() - new Date(item.startTime.replace(/T/g, " ")) > 0) {
          item.state = '进行中';
        }
      }
      else {
        item.timeInterval = timeUtils.getIntervalToCurrentTime(item.startTime)
        if(timeUtils.getTimeStamp(item.startTime) - new Date().getTime() > 0) {
          item.timeInterval += "后";
        }else {
          item.state = '已结束';
          item.timeInterval += "前";
        }
      }
    })
    return res;
  },

  // 滑倒底部获取接下来一页列表
  getNextPage() {
    if(!this.data.showNotice) {
      this.setData({pageIndex: this.data.pageIndex + 1});
      this.getItemList();
    }
  },

  // 点击活动跳转到详情
  toItemDetails(e) {
    let eventId = this.data.itemList[e.currentTarget.dataset.index].activityId;
    wx.navigateTo({
      url: `/activity/pages/detail/detail?eventId=${eventId}&shared=false`,
    })
  },

  switch(e) {
    // 滑动时，e.currentTarget.dataset.selected没有定义
    if (e.currentTarget.dataset.selected === undefined) {
      if (this.data.logined) {
        // 校验认证状态
        if (!this.data.verified) {
          this.setData({selected: 0})
          this.jumpToVerify();
        } else {
          this.setData({selected: e.detail.current})
        }
      } else {
        this.setData({selected: e.detail.current})
      }
    } else if (this.data.logined) {
      // 校验认证状态
      if (!this.data.verified) {
          this.jumpToVerify();
      } else {
        this.setData({selected: e.currentTarget.dataset.selected})
      }
    } else {
      this.setData({selected: e.currentTarget.dataset.selected})
    }
    this.data.selected === SWITCH_LIST.ONE && this.data.mineScoreList.length === 0
      ? (() => {
        this.getScoreList(wx.getStorageSync('isActivityMinePageLatest'));
      })()
      : () => {}
  },

  // 跳转到认证界面
  jumpToVerify() {
    wx.navigateTo({
      url: '/pages/verify/verify',
    })
  },

  getScoreList(isLatest) {

    let isGetNew = typeof isLatest !== "boolean"
      ? true
      : !isLatest
    let url = activityApiPrefix + '/sc/score?force=' + isGetNew
    let getData = requestUtils.doGET(url, {}, header)

    isGetNew
      ? wx.showLoading({
          title: '加载中2333~',
          mask: true
        })
      : {}

    getData.then(res => {

      wx.hideLoading()

      let mineScoreList = res.data.data.detail

      mineScoreList.forEach(item => {
        item.amount = item.amount? item.amount.toFixed(2) : ''
        item.time = item.time.replace(/-/g, " / ")
        item.time = item.time.replace(/T/g, " ")
        item.time = item.time.replace(/\+08:00/g, "")

      })

      this.setData({mineScoreList: mineScoreList})
      wx.setStorageSync('isActivityMinePageLatest', isGetNew)

      this.referSummary()

    }).catch(err => {
      wx.hideLoading()
      wx.showModal({
        title: "哎呀，出错误了 >.<",
        content:
          err.data.code !== 1
            ? err.data.msg
            : "业务逻辑出错",
        showCancel: false,
        complete: err.data.code === 6
          ? (() => {
            app.globalData.identity = {}
            app.globalData.verified = false
            wx.setStorageSync('verified', false)
            wx.setStorageSync('identity', {})
            wx.redirectTo({url: '/pages/verify/verify'})
          })()
          : () => {}
      })
    })
  },

  referSummary() {
    request.fetchData(request.constructUrl("SCORE_SUMMARY", {}), "SCORE_SUMMARY", res => {
      let summary = res
      let index_SCORE_MAX = parseInt(app.globalData.identity.studentId.slice(0,2)) - 18 <= 0
        ? 0
        : 1
      for(let item in summary) {
        if (item === 'total') continue;
        summary[item]= summary[item].toFixed(2)
        if(summary[item] > SCORE_MAX[index_SCORE_MAX][item]) {
          summary[item] = SCORE_MAX[index_SCORE_MAX][item]
        }
      }
      console.log(INDICATOR[index_SCORE_MAX])
      this.setData({
        'option.radar.indicator': INDICATOR[index_SCORE_MAX],
        'option.series[0].data[0].value':[summary.themeReport, summary.socialPractice, summary.campusCulture, summary.creativity, summary.charity, summary.safetyCivilization],
        'option.series[0].data[1].value':[INDICATOR[index_SCORE_MAX][0].max, INDICATOR[index_SCORE_MAX][1].max, INDICATOR[index_SCORE_MAX][2].max, INDICATOR[index_SCORE_MAX][3].max, INDICATOR[index_SCORE_MAX][4].max, INDICATOR[index_SCORE_MAX][5].max]
      })
    })
  },

  // "我的" 下拉刷新
  refresh() {
    // this.setData({refresherTriggered: false})
    setTimeout(() => this.setData({refresherTriggered: false}), 1000)
    // let date = new Date().getDate()
    // console.log(date)
    // app.globalData.verified = false
    // app.globalData.identity = {}
    // wx.setStorageSync('identity', data)
    // wx.setStorageSync('verified', data)
    // wx.showModal({
    //   showCancel: false,
    //   content: 'OA密码可能发生更改',
    //   complete: () => {
    //     this.jumpToVerify()
    //   }
    // })
    this.getScoreList(false)
  },

  setPageData(pageData, data) {
    for(let index in pageData) {
      this.setData({[pageData[index]]: data[index]})
    }
  },

  handlerGohomeClick,
  handlerGobackClick,
  onShareAppMessage,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    this.getItemList();
    this.setData({
      logined: app.globalData.isLogin,
      verified: app.globalData.verified
    });
  },
})
