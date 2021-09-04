// score/pages/index/index.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import onShareAppMessage from "../../../utils/onShareAppMessage";
import getHeader from "../../../utils/getHeader";

const app = getApp();
const requestUtils = require("../../../utils/requestUtils");
const scoreApiUrl = `${app.globalData.apiUrl}/edu/score?`;
const header = getHeader("urlencoded", app.globalData.token);

Page({

  data: {
    tipText: '已经是最新了哦!',
    termList: [],
    yearList: [],
    isFullTerm: true,
    isReferred: false,
    isYearGpa: false,
    isShowText: false,
    scorePageInfo: {
      currentScoreList: [],
      totalScoreList: [],
      termGpa: null,
      yearGpa: null,
      termIndex: 0,
      yearIndex: 0,
    },

  },

  // 获取用户学号
  // getStudentId() {
  //   let data = {}
  //   let url = `${app.globalData.apiUrl}/user/${app.globalData.uid}/identity`
  //   let getData = requestUtils.doGET(url, data, header);
  //   getData.then((res) => {
  //     if(res.data.code === 0) {
  //       console.log("获取学号")
  //       console.log(res.data.data.studentId)
  //       wx.setStorageSync('studentId', res.data.data.studentId)
  //       app.globalData.studentId = res.data.data.studentId
  //       console.log(app.globalData.studentId)
  //     }else {
  //       console.log(res.data.data)
  //     }
  //   }).catch(() => {
  //     console.log("获取学号失败")
  //   })
  // },

  // 计算并设置初始学年和学期数组
  caculateYearArr() {
    let date = new Date()
    let startYear = parseInt(wx.getStorageSync('identity').studentId.slice(0, 2))
    let nowYear = parseInt(date.getFullYear().toString().slice(2, 4))
    let nowMonth = date.getMonth()
    let termInterval = parseInt(((nowYear - startYear) > 1 ? (nowYear - startYear) - 1 : 0) * 2 + (nowMonth + 4) / 6 + 1)
    let yearInterval = parseInt(termInterval / 2 + termInterval % 2)
    if (termInterval % 2) this.setData({isFullTerm: false})

    let baseSring = '20'
    let yearList = []
    for (let i = 0, year = startYear; i < yearInterval; i++, year++) {
      yearList.push(`${baseSring}${year}-${baseSring}${year + 1}`)
    }
    this.setData({yearList})
    this.setData({'scorePageInfo.yearIndex': yearList.length - 1})
    if (this.data.isFullTerm) {
      this.setData({termList: ['第一学期', '第二学期']})
    } else {
      this.setData({termList: ['第一学期']})
    }

    console.log(wx.getStorageSync('identity').studentId)
  },

  // 计算绩点
  getGPA(scoreList) {
    let totalCredits = 0.0
    let t = 0.0
    for (let s of scoreList) {
      t += s.credit * s.score
      totalCredits += s.credit
    }
    return (t / totalCredits / 10.0) - 5.0
  },

  onSelectChange(e) {
    // console.log(this.data.yearList.length)
    if (e.currentTarget.dataset.index_name === "yearIndex") {
      this.setData({'scorePageInfo.yearIndex': e.detail.value})

      if (e.detail.value == this.data.yearList.length - 1 && !this.data.isFullTerm) {
        this.setData({termList: ['第一学期'], 'scorePageInfo.termIndex': 0})
      } else {
        this.setData({termList: ['第一学期', '第二学期']})
      }
    } else {
      this.setData({'scorePageInfo.termIndex': e.detail.value})
    }
    // console.log(this.data.termIndex, this.data.yearIndex)
  },

  // 切换学期和学年绩点
  switchGpa(e) {
    this.setData({isYearGpa: e.detail.value})
  },

  //身份验证
  getVerified() {
    let identityUrl = `${app.globalData.apiUrl}/user/${app.globalData.uid}/identity`
    let getVerified = requestUtils.doGET(identityUrl, {}, header)
    getVerified.then().catch(() => {
        app.globalData.verified = false;
        wx.setStorageSync('verified', false)
        app.globalData.identity = {}
        wx.setStorageSync('identity', {})
        wx.redirectTo({ url: '/pages/verify/verify' })
    })
  },

  // 获取成绩列表
  getScoreList() {
    this.getVerified()

    // console.log(url)
    let yearList = this.data.yearList
    let yearIndex = this.data.scorePageInfo.yearIndex
    let url = scoreApiUrl + `year=${yearList[yearIndex].slice(0, 4)}&semester=0`
    let data = {}
    let getData = requestUtils.doGET(url, data, header)
    getData.then((res) => {

      this.setData({isReferred: true})

      if (res.data.data.score[0] != null) {

        this.setData({"scorePageInfo.yearGpa": this.getGPA(res.data.data.score).toFixed(2)})
        this.setData({"scorePageInfo.totalScoreList": res.data.data.score})

        let currentScoreList = []
        res.data.data.score.forEach((item) => {
          if (parseInt(item.semester) == parseInt(this.data.scorePageInfo.termIndex) + 1) {
            currentScoreList.push(item)
          }
        })

        this.setTipContent(currentScoreList)

        wx.setStorageSync('scorePageInfo', this.data.scorePageInfo)

      } else {

        let scorePageInfo = {
          currentScoreList: [],
          totalScoreList: [],
          termGpa: null,
          yearGpa: null,
          termIndex: 0,
          yearIndex: this.data.yearList.length - 1,
        }
        wx.setStorageSync('scorePageInfo', scorePageInfo)
        scorePageInfo.termIndex = this.data.scorePageInfo.termIndex
        scorePageInfo.yearIndex = this.data.scorePageInfo.yearIndex
        this.setData({scorePageInfo})

      }

    }).catch((res) => {
      console.log(res)
      if (app.globalData.verified) {
        wx.showModal({
          cancelColor: 'cancelColor',
          content: "获取成绩失败，请联系开发人员",
          showCancel: false
        })
      }
    })
  },

  //设定弹出提示语内容
  setTipContent(currentScoreList) {
    if (JSON.stringify(this.data.scorePageInfo.currentScoreList) == JSON.stringify(currentScoreList)) {
      this.setData({tipText: '已经是最新了哦!'})
      this.setData({isShowText: true})
      setTimeout(() => this.setData({isShowText: false}), 2000)
    } else {
      this.setData({
        tipText:
          this.data.scorePageInfo.currentScoreList[0] == null ||
          this.data.scorePageInfo.currentScoreList[0].semester != currentScoreList[0].semester ? '查询成功' : '刷新成功'
      })
      this.setData({isShowText: true})
      setTimeout(() => this.setData({isShowText: false}), 2000)
      this.setData({"scorePageInfo.currentScoreList": currentScoreList})
      this.setData({"scorePageInfo.termGpa": this.getGPA(currentScoreList).toFixed(2)})
    }
  },


  handlerGohomeClick,
  handlerGobackClick,
  onShareAppMessage,

  onLoad () {

    if (!app.globalData.verified || !wx.getStorageSync('identity').studentId) {
      wx.redirectTo({ url: '/pages/verify/verify' })
    }else {
      this.caculateYearArr()
    }

    if (wx.getStorageSync('scorePageInfo')) {
      wx.getStorageSync('scorePageInfo').currentScoreList.length !== 0? () => {
        this.setData({isReferred: true})
        this.setData({scorePageInfo: wx.getStorageSync('scorePageInfo')})
        } : () => {}
    }

    this.data.scorePageInfo.yearIndex !== this.data.yearList.length - 1 ? this.setData({termList: ['第一学期', '第二学期']}) : () => {};


  },

  // onReady () {},
  // onShow () {},

})
