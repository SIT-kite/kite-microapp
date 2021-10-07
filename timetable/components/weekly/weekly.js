Component({
  /**
   * 组件的属性列表
   */
  properties: {
    wlist: {
      type: Array,
    },
  },

  /**
   * 组件的初始数据
   */

  data: {
    colorArrays: [
      "rgba(251,83,82,0.7)",
      "rgba(115,123,250,0.6)",
      "rgba(116, 185, 255,0.7)",
      "rgba(118,126,253,0.7)",
      "rgba(245,175,77,0.7)",
      "rgba(187,137,106,0.7)",
      "rgba(232, 67, 147,0.7)",
      "rgba(188,140,240,0.7)",
      "rgba(116, 185, 255,0.7)",
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getdata(e) {
      let _this = this;
      let data = e.currentTarget.dataset.data;
      console.log(e.currentTarget.dataset);
      _this.triggerEvent("customevent", data);
      _this.data.courseName = data;
      _this.setData({ courseName: data });
    },
  },
});
