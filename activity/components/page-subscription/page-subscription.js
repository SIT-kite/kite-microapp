// activity/components/card-subscription/card-subscription.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    week: {
      type:Array,
      value:['任意', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _showPulldownList() {
      this.setData({isShow: !this.data.isShow})
    },
    closePulldownList() {
      this.setData({isShow: false})
    }
  }
})
