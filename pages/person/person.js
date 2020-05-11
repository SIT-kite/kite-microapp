// pages/person/person.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    test:""
  },
  /**
   * 组件的方法列表
   */
  methods: {
    login: function() {
      wx.login({
        success: (res) => {
          console.log(res);
          wx.request({
            url: 'http://114.99.116.135:8090/session',
            data: {
              wxCode: res.code,
              loginType:0
            },
            method: "POST",
            header:{
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success:  (res)=> {
              this.setData({
                test:res.data.msg
              })
              console.log(res)
            },
            fail: function (res) {
              console.log(res);
            }
          })
        }
      })
    }
  }
})