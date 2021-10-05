// timetable/components/detail/detail.js
let courseName = "计算机文献检索及专业外语";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail: {
      type: Array,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    courseName,
    isShow1: false,
    isShow2: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    detailAnimation1() {
      let isShow1 = this.data.isShow1;
      this.animation = wx.createAnimation({
        //设置动画初始设置
        duration: 300,
        timingFunction: "ease",
      });
      if (isShow1 == false) {
        this.animation.translate(0, -300).step();
        this.setData({ animation1: this.animation.export(), isShow1: true });
      } else {
        this.animation.translate(0, 0).step();
        this.setData({ animation1: this.animation.export(), isShow1: false });
      }
      console.log(isShow1);
    },
    detailAnimation2() {
      let isShow2 = this.data.isShow2;
      this.animation = wx.createAnimation({
        //设置动画初始设置
        duration: 300,
        timingFunction: "ease",
      });
      if (isShow2 == false) {
        this.animation.translate(0, -350).step();
        this.setData({ animation2: this.animation.export(), isShow2: true });
      } else {
        this.animation.translate(0, 0).step();
        this.setData({ animation2: this.animation.export(), isShow2: false });
      }
    },
  },
  ready() {
    console.log("this.properties.detail");
  },
});
