// pages/share/shareFreshmanAnalysis/shareFreshmanAnalysis.js
var app = getApp();
const requestUtils = require("../../../utils/requestUtils");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageReady: false,
    motto: {
      source: "",
      content: ""
    },
    // 分析数据
    freshman: {
      sameName: 0,
      sameCity: "",
      sameHighSchool: "",
      collegeCount: "",
      major: {
        total: "",
        boys: "",
        girls: ""
      }
    },
    // 新生信息
    userDetail: {
      college: "",
      major: "",
      name: ""
    },
  },

  onLoad() {

    this.data.pageReady = false;
    wx.showLoading({ title: "加载中", mask: true });

    // 判定全局变量是否含有需要的信息
    if (undefined === app.globalData.userDetail.major
      && undefined === app.globalData.userDetail.college
      && undefined === app.globalData.userDetail.name) {
      console.log("全局变量不包含userDetail信息");
    } else {
      console.log("全局变量存在userDetail")
      this.setData({ userDetail: app.globalData.userDetail });
    }

    let url = "";
    let data = {};
    let header = {};

    // 获取格言
    url = `${app.globalData.commonUrl}/motto?maxLength=12`;
    data = {};
    header = { 'content-type': 'application/json' };
    var getMotto = requestUtils.doGET(url, data, header);
    getMotto.then(res => {
      const data = res.data.data;
      this.setData({
        motto: {
          source: data.source == null ? "佚名" : source,
          content: data.content,
        }
      });
    }).catch( res => console.log("获取格言失败", res) );

    // 获取分析数据
    url = `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}/analysis?secret=${app.globalData.userInfo.secret}`;
    data = {};
    header = {
      'content-type': 'application/json',
      'Authorization': `Bearer ${app.globalData.token}`,
    };
    var getAnalysis = requestUtils.doGET(url, data, header);
    getAnalysis
      .then(res => this.setData({ freshman: res.data.data.freshman }))
      .catch(res => console.log("获取分析数据失败", res));

    // 等待全部请求完成
    Promise.all([getMotto, getAnalysis])
      .then( () => wx.hideLoading() )
      .catch( res => console.log("请求未全部成功", res) );

    this.setData({ pageReady: true });
  },

  onReady() {},
  onShow() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    return {
      title: "点击查看你的新生画像",
      path: "pages/index/index"
    }
  }
})