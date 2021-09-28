// score/pages/index/index.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import onShareAppMessage from "../../../utils/onShareAppMessage";
import getHeader from "../../../utils/getHeader";
import {doGET} from "../../../utils/requestUtils";

const app = getApp();
const requestUtils = require("../../../utils/requestUtils");
const scoreApiUrlPrefix = `${app.globalData.apiUrl}/edu/score`;
const header = getHeader("urlencoded", app.globalData.token);

const REQUEST_PURPOSE = ['FOR_LIST', 'FOR_DETAIL']
const API_URL_PREFIX = {
  LIST: `${scoreApiUrlPrefix}?`,
  DETAIL: `${scoreApiUrlPrefix}/detail?`
}

Page({

  data: {
    termList: [],
    yearList: [],
    scoreList: [],
    gpa: [],
    isShowText: false,
    isShowTip: true,
    scoreInfo: {
      isFirstTime: true,
      termIndex: 0,
      yearIndex: 0,
    },

  },

  createDateInfoObjectForSetSelectList() {

    let date = new Date()
    let nowYear = parseInt(date.getFullYear().toString().slice(2, 4))
    let nowMonth = date.getMonth()
    let startYear = parseInt(wx.getStorageSync('identity').studentId.slice(0, 2))
    let termInterval = parseInt(((nowYear - startYear) > 1 ? (nowYear - startYear) - 1 : 0) * 2 + (nowMonth + 4) / 6 + 1)
    let yearInterval = parseInt(termInterval / 2 + termInterval % 2)

    return {
      startYear: startYear,
      termInterval: termInterval,
      yearInterval: yearInterval,
    }

  },

  setYearList(object) {
    let baseString = '20'
    let yearList = []

    for (let i = 0, year = object.startYear; i < object.yearInterval; i++, year++) {
      yearList.push(`${baseString}${year}-${baseString}${year + 1}`)
    }

    this.setData({yearList})
    this.setData({'scoreInfo.yearIndex': yearList.length - 1})
  },

  setTermList() {
    this.setData({termList: ['第一学期', '第二学期', '整个学年']})
  },

  setSelectList() {

    let object = this.createDateInfoObjectForSetSelectList()

    this.setYearList(object)
    this.setTermList(true)

  },

  // 计算绩点
  getGPA(scoreList) {

    let totalCredits = 0.0
    let t = 0.0

    for (let c of scoreList) {
      if (c.courseId[0] === 'G' || c.isEvaluated === false) continue;
      t += c.credit * c.score
      totalCredits += c.credit
    }

    return (t / totalCredits / 10.0) - 5.0

  },

  onSelectChange(e) {

    if (e.currentTarget.dataset.index_name === "yearIndex") {
      this.setData({'scoreInfo.yearIndex': parseInt(e.detail.value)})
    } else {
      this.setData({
        'scoreInfo.termIndex': e.detail.value,
      })
    }

    this.referList(true)

  },

  constructParams(requestPurpose, param) {
    let params = {
      year: this.data.yearList[this.data.scoreInfo.yearIndex],
      semester: parseInt(this.data.scoreInfo.termIndex) + 1 === this.data.termList.length
        ? 0
        : parseInt(this.data.scoreInfo.termIndex) + 1
    };
    switch (requestPurpose) {
      case (REQUEST_PURPOSE[0]) : {
        params.force = param
        break;
      }
      case (REQUEST_PURPOSE[1]) : {
        params.classId = param
        break;
      }
    }
    return params
  },

  constructApiUrl(requestPurpose, params) {

    let apiUrl = '';

    switch (requestPurpose) {
      case (REQUEST_PURPOSE[0]) : apiUrl = `${API_URL_PREFIX.LIST}year=${params.year}&semester=${params.semester}&force=${params.force}`; break;
      case (REQUEST_PURPOSE[1]) : apiUrl = `${API_URL_PREFIX.DETAIL}year=${params.year}&semester=${params.semester}&class_id=${params.classId}`; break;
    }

    return apiUrl

  },

  fetchList: function(apiUrl, callback) {

    let scoreList = []
    let getData = requestUtils.doGET(apiUrl, {}, header)

    wx.showLoading({
      title: '加载中2333~',
      mask: true
    })

    getData.then((res) => {
      wx.hideLoading()
      scoreList =  res.data.data.score
      callback(scoreList)
    }).catch((err) => {
      this.handlefetchListError(err)
    })

  },

  handlefetchListError(err) {

    wx.showModal({
      title: "哎呀，出错误了 >.<",
      content:
        err.data.code !== 1
          ? err.data.msg
          : "业务逻辑出错",
      showCancel: false,
      complete: err.data.code === 6
        ? () => {
          app.globalData.identity = {}
          app.globalData.verified = false
          wx.setStorageSync('verified', false)
          wx.setStorageSync('identity', {})
          wx.redirectTo({url: '/pages/verify/verify'})
        }
        : () => {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
    })

  },

  setPageData(pageData, data) {
    for(let index in pageData) {
      this.setData({[pageData[index]]: data[index]})
    }

  },

  //弹出提示语
  popUpTip() {
    this.setData({isShowText: true})
    setTimeout(() => this.setData({isShowText: false}), 2000)
  },

  referList(force) {

    let scoreList = []
    this.fetchList(this.constructApiUrl('FOR_LIST', this.constructParams('FOR_LIST', force)), (res) => {
      scoreList = res
      scoreList.forEach((course) => {
        course.isFolded = true
        if(course.detail) {
          course.detail.forEach(item => {
            item.score = item.score.toFixed(1)
          })
        }
      })
      this.setPageData(['scoreList','gpa', 'scoreInfo.isFirstTime'], [scoreList, scoreList.length != 0? this.getGPA(scoreList).toFixed(2) : null, scoreList.length != 0
        ? false : true])
      wx.setStorageSync('scoreInfo', this.data.scoreInfo)
    })
    force
      ? this.popUpTip()
      : {}
  },

  refresh() {
    this.referList(true)
  },

  fetchDetail(apiUrl, callback) {

    let detail = []
    let getData = requestUtils.doGET(apiUrl, {}, header)
    console.log(apiUrl)
    wx.showLoading({
      title: '加载中2333~',
      mask: true
    })

    getData.then((res) => {
      wx.hideLoading()
      detail = res.data.data.score_detail
      callback(detail)
    }).catch((err) => {
      this.handlefetchListError(err)
    })

  },

  doAnimation(isFolded) {

  },

  referDetail(course, detailToSet) {
    this.fetchDetail(this.constructApiUrl('FOR_DETAIL', this.constructParams('FOR_DETAIL', course.classId)), (res) => {
      res.forEach(item => {
        item.score = item.score.toFixed(1)
      })
      this.setData({[detailToSet] : res})
    })
  },

  showDetail(index, course) {
    let detailToSet = `scoreList[${index}].detail`
    !course.detail
      ? this.referDetail(course, detailToSet)
      : () => {
        this.doAnimation()
      }
  },

  bindCard(e) {
    let index = e.currentTarget.dataset.index
    let course = this.data.scoreList[index]
    course.isFolded
      ? course.isEvaluated
          ? this.showDetail(index, course)
          : {}
      : {}

  },

  setIsShowTip(isFirstTime) {
    !isFirstTime
      ? this.setData({isShowTip: false})
      : {}
  },

  handlerGohomeClick,
  handlerGobackClick,
  onShareAppMessage,

  onLoad () {
    !app.globalData.verified || !wx.getStorageSync('identity').studentId
      ? wx.redirectTo({ url: '/pages/verify/verify' })
      : this.setSelectList()

    let scoreInfo = wx.getStorageSync('scoreInfo')
    scoreInfo
      ? this.setData({scoreInfo})
      : {}
    this.setIsShowTip(this.data.scoreInfo.isFirstTime)
    this.referList(this.data.scoreInfo.isFirstTime)
  },
})
