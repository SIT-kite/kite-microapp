// custom-tab-bar/index.js
Component({

  properties: {},

  data: {
    selected: 0,
    list: [{
      pagePath: "/pages/index/index",
      text: "主页",
      iconPath: "/asset/icon/home.png",
      selectedIconPath: "/asset/icon/home_active.png"
    }, {
      pagePath: "/pages/person/person",
      text: "我",
      iconPath: "/asset/icon/user.png",
      selectedIconPath: "/asset/icon/user_active.png"
    }]
  },

  methods: {
    switchTab(e) {
      wx.switchTab({url: e.currentTarget.dataset.path})
    }
  }
})
