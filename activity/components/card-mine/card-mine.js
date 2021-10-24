// activity/components/card.js
const CSS_CLASS_STATES = {
  '审核中':'underway',
  '通过':'succeed',
  '未通过':'fail',
  '已撤销': 'fail'
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
    },
    condition: {
      type: String,
    },
    item_id: {
      type: Number,
    },
    date: {
      type: String,
    },
    category: {
      type: String,
    },
    detail: {
      type:String
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    CSS_CLASS_STATES

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap() {
      wx.navigateTo({
        url: `/activity/pages/detail/detail?eventId=${this.data.item_id}`,
      })
    }
  }
})
