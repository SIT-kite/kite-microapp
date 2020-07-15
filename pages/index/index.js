//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    selected: -1,
    id:"",
    animation_data: "",
    menu_list: [{
        id:"notice",
        text: "通知",
        iconPath: "/asset/icon/icon_6h444ajjwem/notice.png"
      },
      {
        id:"activity",
        text: "活动",
        iconPath: "/asset/icon/icon_6h444ajjwem/tuandui.png"
      },
      {
        id:"shopping",
        text: "闲置",
        iconPath: "/asset/icon/icon_6h444ajjwem/dianpu.png"
      }, {
        id:"lost",
        text: "失物",
        iconPath: "/asset/icon/icon_6h444ajjwem/sousuo.png"
      }, {
        id:"education",
        text: "教务",
        iconPath: "/asset/icon/icon_6h444ajjwem/kecheng.png"
      }, {
        id:"share",
        text: "分享",
        iconPath: "/asset/icon/icon_6h444ajjwem/fenxiang.png"
      }
    ]
  },

  move: function (e) {
    this.setData({
      animation_data: "animation:living .5s ease;",
      selected : e.currentTarget.dataset.index,
      id:e.currentTarget.dataset.id
    });
    this.router(this.data.id)
  },
  router:function(id){
    const currenturl = id+'/'+id;
    console.log(currenturl);
    wx.navigateTo({
      url:`/pages/${currenturl}`,
      success:function(){}, //接口调用成功的回调函数
      fail:function(){}, //接口调用失败的回调函数
      complete:function(){} //接口调用结束的回调函数（调用成功、失败都会执行）
  })
  },
  onShow: function (e) {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },
  go_temp:function(e){
    wx.navigateTo({
      url: '/pages/temp_activity/temp_activity',
      success:function(){}, //接口调用成功的回调函数
      fail:function(){}, //接口调用失败的回调函数
      complete:function(){} //接口调用结束的回调函数（调用成功、失败都会执行）
    })
  }
})