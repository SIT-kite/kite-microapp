// activity/components/card-subscription/card-subscription.js
Component({

  properties: {
    week: {
      type: Array,
      value: ['任意', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
    }
  },

  data: {
    isShowPulldownList: false,
    isShowModel: false,
  },

  methods: {
    _showPulldownList() {
      this.setData({isShowPulldownList: !this.data.isShow})
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
  }

});
