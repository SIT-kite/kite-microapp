// score/pages/index/index.js

import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import onShareAppMessage from "../../../utils/onShareAppMessage";
import getHeader from "../../../utils/getHeader";
import loading from "../../../utils/loading";
import { isNonEmptyString } from "../../../utils/type";
const requestUtils = require("../../../utils/requestUtils");

const app = getApp();
const gData = app.globalData;
const header = getHeader("urlencoded", gData.token);

const REQUEST_PURPOSE = [ "FOR_LIST", "FOR_DETAIL" ];

const scoreApiUrlPrefix = `${gData.apiUrl}/edu/score`;
const API_URL_PREFIX = {
  LIST: `${scoreApiUrlPrefix}?`,
  DETAIL: `${scoreApiUrlPrefix}/detail?`
};

// getYears(): years: [ "2020-2021", "2021-2022", ... ]
// 这这这得好好简化一下
const getYears = (studentId) => {

  const date = new Date()
  const nowMonth = date.getMonth()
  const nowYear = parseInt(date.getFullYear().toString().slice(2, 4))
  const startYear = parseInt(studentId.slice(0, 2))

  let diffYear = nowYear - startYear;
  diffYear = diffYear > 1 ? diffYear - 1 : 0;

  const termInterval = parseInt(diffYear * 2 + (nowMonth + 4) / 6 + 1)
  const yearInterval = parseInt(termInterval / 2 + termInterval % 2)

  // console.log({nowMonth, nowYear, startYear, diffYear, termInterval, yearInterval});

  let baseString = '20'
  let years = []

  for (let i = 0, year = startYear; i < yearInterval; i++, year++) {
    // console.log(year);
    years.push(`${baseString}${year}-${baseString}${year + 1}`)
  }

  return years

}

Page({

  data: {
    showSelectYear: false,
    showSelectTerm: false,
    terms: [ '第一学期', '第二学期', '整个学年' ],
    years: [ '学年' ],
    scoreList: [],
    gpa: null,
    isShowText: false,
    isShowTip: true,
    scoreInfo: {
      isFirstTime: true,
      termIndex: 0,
      yearIndex: 0,
    },

  },

  onLoad() {

    const studentId = gData.identity?.studentId;
    if ( gData.verified !== true || !isNonEmptyString(studentId) ) {
      // 未认证
      wx.redirectTo({ url: '/pages/verify/verify' })
    } else {
      // 已认证
      const years = getYears(studentId);
      this.setData({ years, 'scoreInfo.yearIndex': years.length - 1 })
    }

    const scoreInfo = wx.getStorageSync('scoreInfo')
    if (scoreInfo !== '') {
      this.setData({scoreInfo})
      const isFirstTime = this.data.scoreInfo.isFirstTime
      this.setIsShowTip(isFirstTime)
      this.referList(isFirstTime)
    }

  },

  // toggleSelect(e.target.dataset?.select: String)
  // 按照被点击元素，展开或收起选择器
  toggleSelect(e) {

    // 选择器列表
    let selects = [ "showSelectYear", "showSelectTerm" ];

    // 如果点击了某个列表内的选择器，展开或收起它，并从要收起的选择器列表中排除它
    const select = e.target.dataset.select;
    if ( select !== undefined && selects.includes(select) ) {
      this.setData({ [select]: !this.data[select] })
      selects.splice(selects.indexOf(select))
    }

    // 收起其他展开的选择器
    selects = selects.filter( key => this.data[key] === true )

    selects.length > 0 &&
    this.setData(
      Object.fromEntries(
        selects.map( key => [key, false] )
      )
    )

  },

  selectYear(e) {
    this.setData({ 'scoreInfo.yearIndex': parseInt(e.target.dataset.index) })
    this.referList(false)
  },
  selectTerm(e) {
    this.setData({ 'scoreInfo.termIndex': parseInt(e.target.dataset.index) })
    this.referList(false)
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
      this.setData({ 'scoreInfo.yearIndex': parseInt(e.detail.value) })
    } else {
      this.setData({ 'scoreInfo.termIndex': e.detail.value })
    }

    this.referList(false)

  },

  constructParams(requestPurpose, param) {
    let params = {
      year: this.data.years[this.data.scoreInfo.yearIndex],
    };
    switch (requestPurpose) {
      case (REQUEST_PURPOSE[0]) : {
        params.force = param
        params.semester = parseInt(this.data.scoreInfo.termIndex) + 1 === this.data.terms.length
        ? 0
        : parseInt(this.data.scoreInfo.termIndex) + 1
        break;
      }
      case (REQUEST_PURPOSE[1]) : {
        params.classId = param.classId
        params.semester = param.semester
        break;
      }
    }

    return params
  },

  constructApiUrl(requestPurpose, params) {

    let apiUrl = '';

    switch (requestPurpose) {
      case REQUEST_PURPOSE[0]:
        apiUrl = `${API_URL_PREFIX.LIST}year=${params.year}&semester=${
          params.semester}&force=${params.force}`;
      break;
      case REQUEST_PURPOSE[1]:
        apiUrl = `${API_URL_PREFIX.DETAIL}year=${params.year}&semester=${
          params.semester}&classId=${params.classId}`;
      break;
    }

    return apiUrl

  },

  fetchScore(apiUrl, callback) {

    loading({
      title: '加载中2333~',
      mask: true,
      callback: requestUtils.doGET(apiUrl, {}, header).then(
        res => callback(res.data.data.score)
      ).catch(this.handleFetchError)
    })

  },

  handleFetchError(err) {

    wx.showModal({
      title: "哎呀，出错误了 >.<",
      content:
        err.data.code !== 1
          ? err.data.msg
          : "业务逻辑出错",
      showCancel: false,
      complete: err.data.code === 6
        ? () => {
          gData.identity = {}
          gData.verified = false
          wx.setStorageSync('verified', false)
          wx.setStorageSync('identity', {})
          wx.redirectTo({ url: '/pages/verify/verify' })
        }
        : () => wx.switchTab({ url: '/pages/index/index' })
    })
  },

  // 弹出提示语
  popUpTip() {
    this.setData({isShowText: true})
    setTimeout(() => this.setData({isShowText: false}), 2000)
  },

  handleDetail(detail) {
    detail.forEach(
      item => item.score = item.score.toFixed(1)
    )
    return detail
  },

  handleList(scoreList) {

    scoreList.forEach((course) => {
      course.isFolded = true
      course.isRequiredCourse = course.courseId[0] !== 'G'
      if (course.detail) {
        course.detail = this.handleDetail(course.detail)
      }
    })

    this.setData({
      scoreList,
      gpa: scoreList.length !== 0 ? this.getGPA(scoreList).toFixed(2) : null,
      'scoreInfo.isFirstTime': scoreList.length === 0
    })
    wx.setStorageSync('scoreInfo', this.data.scoreInfo)
  },

  referList(force) {

    this.fetchScore(
      this.constructApiUrl(
        'FOR_LIST', this.constructParams('FOR_LIST', force)
      ), this.handleList
    )

    force && this.popUpTip()

  },

  refresh() {
    this.referList(true)
  },

  fetchDetail(apiUrl, callback) {

    loading({
      title: '加载中2333~',
      mask: true,
      callback: requestUtils.doGET(apiUrl, {}, header).then(
        res => callback(res.data.data.scoreDetail)
      ).catch(this.handleFetchError)
    })


  },

  referDetail(course, detailToSet) {
    this.fetchDetail(
      this.constructApiUrl(
        'FOR_DETAIL', this.constructParams('FOR_DETAIL', course)
      ),
      (res) => {
        res = this.handleDetail(res)
        this.setData({[detailToSet] : res})
      }
    )
  },

  showDetail(index, course) {
    let detailToSet = `scoreList[${index}].detail`
    !course.detail &&
    this.referDetail(course, detailToSet)
  },

  bindCard(e) {
    const index = e.currentTarget.dataset.index
    const course = this.data.scoreList[index]
    course.isFolded &&
    course.isEvaluated &&
    this.showDetail(index, course)

  },

  setIsShowTip(isFirstTime) {
    !isFirstTime &&
    this.setData({isShowTip: false})
  },

  handlerGohomeClick,
  handlerGobackClick,
  onShareAppMessage

})
