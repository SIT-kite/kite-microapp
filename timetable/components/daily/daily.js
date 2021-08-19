// timetable/components/daily/daily.js
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  },
  ready(){
    console.log(this.data.list);
    // this.setData({list: this.data.list});
},

})
