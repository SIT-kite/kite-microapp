// activity/components/card.js


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
      type:Number
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

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
