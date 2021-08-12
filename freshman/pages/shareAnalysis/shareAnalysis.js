// freshman/pages/shareAnalysis/shareAnalysis.js
import request from "../../../utils/request";
import getHeader from "../../../utils/getHeader";

var app = getApp();

Page({

  data: {
    pageReady: false,
    // 格言
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

    wx.showLoading({ title: "加载中", mask: true });

    const gData = app.globalData;

    if (gData.userDetail !== null) {
      this.setData({ userDetail: gData.userDetail });
    }

    // 获取格言
    var getMotto = request({
      method: "GET",
      url: `${gData.commonUrl}/motto?maxLength=12`,
      header: getHeader("json")
    }).then(res => {
      const data = res.data.data;
      this.setData({
        motto: {
          source: data.source ?? "佚名",
          content: data.content,
        }
      });
    }).catch( res => console.log("格言获取失败", res) );

    // 获取分析数据
    const {account, secret} = gData.userInfo;
    var getAnalysis = request({
      method: "GET",
      url: `${gData.commonUrl}/freshman/${account}/analysis?secret=${secret}`,
      header: getHeader("json", app.globalData.token)
    }).then(
      res => this.setData({ freshman: res.data.data.freshman })
    ).catch(
      res => console.log("分析数据获取失败", res)
    );

    // 等待全部请求完成
    Promise.all([getMotto, getAnalysis])
      .then( () => wx.hideLoading() )
      .catch( res => console.log("请求未全部成功", res) );

    this.setData({ pageReady: true });
    wx.hideLoading();

  },

  onReady() {},
  onShow() {},

  onShareAppMessage: () => ({
    title: "点击查看你的新生画像",
    path: "pages/index/index"
  })

})