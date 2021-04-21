// custom-tab-bar/index.js
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
    selected: 0,
    list: [{
      pagePath: "/pages/index/index",
      text: "主页",
      iconpath: "/asset/icon/home.png",
      selectedIconPath: "/asset/icon/home_active.png"
    }, {
      pagePath: "/pages/person/person",
      text: "我",
      iconpath: "/asset/icon/user.png",
      selectedIconPath: "/asset/icon/user_active.png"
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      wx.switchTab({
        url: e.currentTarget.dataset.path
      })
    }
  }
})
