// timetable/components/detail/detail.js
let courseName = "计算机文献检索及专业外语"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail:{
      type: Array,
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    courseName
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  ready(){
console.log('this.properties.detail')
  }
})
