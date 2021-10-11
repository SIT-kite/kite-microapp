// canteen/pages/index/index.js

Page({

  data: {
    sidebar: false,
    canteens: [
      {
        name: "一食堂", floors: [
          {
            name: "一楼", windows: [
              {
                name: "窗口1",
                menus: [
                  {
                    name: "类型1", dishes: [
                      { name: "选项1", price: 5 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  showSidebar() { this.setData({ sidebar: true }); },
  hideSidebar() { this.setData({ sidebar: false }); },

  onLoad() {

  },

  onReady() {

  },

  onShow() {

  },

  onHide() {

  },

  onUnload() {

  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },

  onShareAppMessage() {

  }
})
