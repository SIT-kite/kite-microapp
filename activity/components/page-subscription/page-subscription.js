// activity/components/card-subscription/card-subscription.js
Component({

  properties: {
    week: {
      type: Array,
      value: ['任意', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
    },
    campus: {
      type: Array,
      value: ['奉贤校区', '徐汇校区']
    }
  },
  data: {
    isShowPulldownList: false,
    isShowModel: false,
    isShowSelectWeek: false
  },

  methods: {
    _showPulldownList() {
      this.setData({isShowPulldownList: !this.data.isShow})
    },
    _showSelectWeek() {
      this.setData({isShowSelectWeek: true})
      this.animation.scale(1).step()
      // setTimeout(() => {
        this.setData({animation: this.animation.export()})
      // }, 100)
      // this.setData({isShowSelectWeek: !this.data.isShowSelectWeek})
      // this.animation.scale(1).step()
      // setTimeout(() => {
      //   this.setData({animation: this.animation.export()})
      // }, 100)
    },
    _closeSelectWeek() {
      this.animation.scale(0.01).step()
      this.setData({animation: this.animation.export()})
      setTimeout(() => {
        this.setData({isShowSelectWeek: false})
      }, 200)
    },
    closePulldownList() {
      this.setData({isShowPulldownList: false})
    },
    showModel() {
      this.setData({isShowModel: true})
      this.setData({isShowPulldownList: false})
    },
    closeModel() {
      this.setData({isShowModel: false})
    }
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease'
      })
    },
  }
});
