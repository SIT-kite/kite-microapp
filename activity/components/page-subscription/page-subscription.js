// activity/components/card-subscription/card-subscription.js
Component({

  properties: {
    week: {
      type: Array,
      value: ['任意', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
    }
  },

  data: {
    isShow: false,
  },

  methods: {
    _showPulldownList() {
      this.setData({isShow: !this.data.isShow})
    },
    closePulldownList() {
      this.setData({isShow: false})
    }
  }

});
