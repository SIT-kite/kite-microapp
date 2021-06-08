// components/tag/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    groupBy: {
      type: String,
      value: ''
    },
    content: {
      type: String,
      value: ''
    },
    selected: {
      type: Boolean,
      value: false
    }
  },
  lifetimes: {
    attached() {
      const {
        groupBy,
        selected
      } = this.properties
      groupBy || console.error("group-by为必填属性!!!")
      selected && this.setData({
        _selected: selected
      })
    }
  },
  observers:{
    selected(_selected){
      this.setData({
        _selected
      })
    }
  },
  data: {
    _selected: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tap() {
      const _selected = !this.data._selected
      this.setData({
        _selected
      })
      this.triggerEvent("onChange", {
        groupBy: this.properties.groupBy,
        content: this.properties.content,
        selected: _selected
      }, {
        bubbles: true
      })
    }
  }
})