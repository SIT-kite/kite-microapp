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
    selected:0,
    list: [{
      pagePath: "/pages/index/index",
      text: "主页",
      iconpath:"/asset/icon/home (2).png",
      selectedIconPath:"/asset/icon/home (3).png"
    },{
      pagePath: "/pages/person/main",
      text: "个人",
      iconpath:"/asset/icon/user.png",
      selectedIconPath:"/asset/icon/user (1).png"
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
   switchTab(e){
    const data = e.currentTarget.dataset
    const url = data.path
    wx.switchTab({
       url
    })
   }
  }
})
