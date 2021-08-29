// freshman/pages/shareAnalysis/shareAnalysis.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
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

  // onReady() {},
  // onShow() {},
  handlerGohomeClick,
  handlerGobackClick,
  onShareAppMessage: () => ({
    title: "用上应小风筝，查看你的新生画像",
    path: "pages/index/index"
  }),

  onLoad() {

    wx.showLoading({ title: "正在加载…", mask: true });

    const gData = app.globalData;

    if (gData.userDetail === null) {
      wx.redirectTo({ url: "/freshman/pages/welcome/welcome" });
      wx.hideLoading();
      return;
    }

    this.setData({ userDetail: gData.userDetail });

    // 获取格言
    var getMotto = request({
      url: `${gData.apiUrl}/motto?maxLength=12`
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
    const { account, secret } = gData.userInfo;
    var getAnalysis = request({
      url: `${gData.apiUrl}/freshman/${account}/analysis`,
      header: getHeader("json", app.globalData.token),
      data: { secret }
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

  }

})
