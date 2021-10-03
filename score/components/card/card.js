// score/components/card/card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name:{
      type:String,
    },
    credit: {
      type:String,
    },
    isRequiredCourse: {
      type:Boolean,
    },
    semester: {
      type: String,
    },
    grades: {
      type:String
    },
    isFolded: {
      type: Boolean,
      value: true
    },
    detailList: {
      type: Array
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
      this.triggerEvent('bindCard')
      if(this.data.isFolded) {
        this.setData({isFolded: false})
        this.animation.scale(1, 1).step()
        this.setData({animation: this.animation.export()})
      }else {
        // this.animation.scale(1, 0).step()
        //   this.setData({animation: this.animation.export()})
        //   setTimeout(() => {
            this.setData({isFolded: true})
          // }, 100);
      }
    }
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease'
      })
    },
  }
})
