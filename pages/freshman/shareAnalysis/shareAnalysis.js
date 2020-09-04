// pages/share/shareFreshmanAnalysis/shareFreshmanAnalysis.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: {
      source: "",
      content: ""
    },
    tempData: {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc19hZG1pbiI6dHJ1ZSwidWlkIjoxMH0.tY2adWTqpK21lqquSbxYLT3Zvwn83q8K0U0J59oeeFM",
      account: "1812100505",
      secret: "120419",
    },
    requestData: {
      token: "",
      account: "",
      secret: "",
    },
    // 分析数据
    freshman: {
      sameName: 0,
      sameCity: null,
      sameHighSchool: null,
      collegeCount: null,
      major: {
        total: null,
        boys: null,
        girls: null
      }
    },
    // 新生信息
    userDetail: {
      college: null,
      major: null,
      name: null
    },
    shareTempFilePath: null,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中",
      mask: true,
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
    var that = this
    // 判定全局变量是否含有需要的信息
    console.log(app.globalData.userDetail)
    if (undefined === app.globalData.userDetail.major
      && undefined === app.globalData.userDetail.college
      && undefined === app.globalData.userDetail.name) {
      console.log("全局变量不包含userDetail信息")
      this.setData({
        userDetail: {
          college: "人文学院",
          major: "公共管理类",
          name: "宋安邦"
        }
      });
    } else {
      console.log("全局变量存在userDetail")
      this.setData({
        userDetail: app.globalData.userDetail
      });
    }

    // 获取格言
    var reqTask = wx.request({
      url: `${app.globalData.commonUrl}/motto?maxLength=12`,
      data: {},
      header: { 'content-type': 'application/json' },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log(`获取格言成功: content: ${result.data.data.content} source:${result.data.data.source}`)
        that.setData({
          motto: {
            source: result.data.data.source == null ? "佚名" : result.data.data.source,
            content: result.data.data.content,
          }
        });
        console.log(that.data.motto)
      },
      fail: () => { },
      complete: () => { }
    });


    // 获取分析数据  实际环境注意修改tempData
    let url = `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}/analysis?secret=${app.globalData.userInfo.secret}`
    console.log(url)
    console.log("请求统计数据中")
    var reqTask = wx.request({
      url: url,
      data: {},
      header: {
        'content-type': 'application/json',
        // XXX
        'Authorization': `Bearer ${app.globalData.token}`,
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log(result.data)
        that.setData({
          freshman: result.data.data.freshman
        })
        console.log(that.data.freshman)

      },
      fail: () => { },
      complete: () => { wx.hideLoading(); }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})