// score/components/card/card.js

Component({

  properties: {
    name:{ type: String },
    credit: { type: String },
    isRequiredCourse: { type: Boolean },
    semester: { type: String },
    grades: { type: String },
    isFolded: { type: Boolean, value: true },
    detailList: { type: Array }
  },

  data: {},

  methods: {
    onTap() {
      this.triggerEvent('bindCard')
      if (this.data.isFolded) {
        this.setData({isFolded: false})
        this.animation.scale(1, 1).step()
        this.setData({animation: this.animation.export()})
      } else {
        // this.animation.scale(1, 0).step()
        //   this.setData({animation: this.animation.export()})
        //   setTimeout(() => {
            this.setData({isFolded: true})
          // }, 100);
      }
    }
  },
  lifetimes: {
    attached() { // 在组件实例进入页面节点树时执行
      this.animation = wx.createAnimation({ duration: 1000, timingFunction: "ease" })
    },
  }
});
