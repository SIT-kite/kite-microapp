// timetable/components/daily/daily.js
let courseName = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type: Array,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    courseName
  },

    behaviors: ['wx://component-export'],
    export() {
      return this.data.courseName
    },
  /**
   * 组件的方法列表
   */
  methods: {
    getdata(e){
      let _this = this
      let data= e.currentTarget.dataset.data
      console.log(e.currentTarget.dataset.data)
      _this.triggerEvent('customevent', data) 
      _this.data.courseName = data
      _this.setData({courseName : data})
    },
  }

})
