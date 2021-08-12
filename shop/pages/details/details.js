// page/component/details/details.js
import {
  handlerGohomeClick,
  handlerGobackClick
} from '../../../utils/navBarUtils';

Page({
  
  // 导航栏函数
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick,

  data:{
    goods: {
      id: 1,
      image: '/image/goods1.png',
      title: '高等数学',
      price: 1000000,
      stock: '发布者修改录入信息的时间',
      detail: '这里是高等数学详情。',
      parameter: '￥1000000',
      service: ''
    },
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false
  },

  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num : num
    })
  },

  addToCart() {
    const self = this;
    const num = this.data.num;
    let total = this.data.totalNum;

    self.setData({
      show: true
    })
    setTimeout( function() {
      self.setData({
        show: false,
        scaleCart : true
      })
      setTimeout( function() {
        self.setData({
          scaleCart: false,
          hasCarts : true,
          totalNum: num + total
        })
      }, 200)
    }, 300)

  },

  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }
 
})