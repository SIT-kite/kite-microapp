// components/drive-card/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    schedule: {
      type: Object,
      value: {}
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
    contact(e) {
      this.triggerEvent('contact', {
        schedule: this.properties.schedule
      }, {
        bubbles: true
      })
    }
  }
})
