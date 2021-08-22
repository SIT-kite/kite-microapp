// custom-tab-bar/index.js
Component({

  properties: {},

  data: {
    selected: 0,
    list: [{
      pagePath: "/pages/index/index",
      text: "主页",
      iconPath: "/assets/icons/nav_bar/home.png",
      selectedIconPath: "/assets/icons/nav_bar/home_active.png"
    }, {
      pagePath: "/pages/user/user",
      text: "我",
      iconPath: "/assets/icons/nav_bar/user.png",
      selectedIconPath: "/assets/icons/nav_bar/user_active.png"
    }]
  },

  methods: {
    switchTab(e) {
      wx.switchTab({url: e.currentTarget.dataset.path})
    }
  }
})
