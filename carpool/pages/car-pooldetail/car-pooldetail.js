// pages/car-pooldetail/car-pooldetail.js
import {
  handlerGohomeClick,
  handlerGobackClick
} from "../../../utils/navBarUtils";




Page({

  /**
   * 页面的初始数据
   */
  data: {

     // 弹出详情
     showModalStatus: true,//是否显示
     gg_id: 0,//规格ID
     gg_txt: '',//规格文本
     gg_price: 0,//规格价格
     guigeList: [{ guige: '100', price: '150' }, { guige: '200', price: '150' }, { guige: '300', price: '150' }],
     num: 1,//初始数量
     minusStatus: 'disabled',

      markers: [{
        iconPath: "/asset/icon/main_icon/mark.png",
        id: 0,
        longitude: 120.640509,
        latitude: 31.304899,
        width: 19,
        height: 33
      }],
      markers: [{ // 绘制浮标，传入JSON支持多个
        iconPath: "/asset/icon/main_icon/mark.png", //浮标图片路径，推荐png图片
        id: 0, // Id支持多个，方便后期点击浮标获取相关信息
        longitude: 121.510643, // 经度
        latitude: 30.84262, //纬度
        width: 50, // 浮标宽度
        height: 50 // 浮标高度
      },
      {
        iconPath: "/asset/icon/main_icon/mark.png",
        id: 0, 
        longitude: 121.429462,
        latitude: 31.153127,
        width: 50,
        height: 50 
      },
    ],
      polyline: [{ // 绘制多边形区域，两个点绘制直线
        points: [ // 这里传入两个点是直线，如果传入三个点以上就会是首尾相连的多边形区域
          {
            longitude: 121.510643,
            latitude: 30.84262
          }, {
            longitude: 121.429462,
            latitude: 31.153127
          }],
          color: "#FF0000DD", // 设置颜色
          width: 2, // 设置线宽度 注：电脑模拟器无法预览测设设置，此设置需要手机测试
          dottedLine: true // 是否设置为虚线
      }],
  


      currentView:0,
    calendarShowing:false,
    dateSelected:'',
    isExpanding:false,
    //mock data
    schedules:[{
      userID:1,
      scheduleID:1,
      origin:'起点',
      destination:'目的地',
      date:'2020-6-6',
      sex:'男',
      time:'9:00',
      mates:[{
        userID:'',
        sex:'女',
        telephone:''
      },{
        userID:'',
        sex:'男',
        telephone:''
      }],
      status:'raise', // options:raise||finish
      purposeRaiseNum:3,
    },{
      origin:'起点',
      destination:'目的地',
      date:'2020-6-6',
      sex:'女',
      time:'9:00',
      mates:[{
        userID:'',
        sex:'女',
        telephone:''
      }],
      status:'raise', // options:raise||finish
      purposeRaiseNum:3,
    }],

  },

  onClickWant: () => {
    
    wx.showModal({
      title: '联系方式',
      content: '1244235235',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  // markertap(e) { // 这是一个事件，在wxml中绑定这个事件，点击浮标后
  //   wx.openLocation({ //此设置属于高级APi,可以打开微信内置地图组件
  //     latitude: 23.099994,
  //     longitude: 113.324520,
  //   });
  // },

   // 导航栏函数
   handlerGohomeClick: handlerGohomeClick,
   handlerGobackClick: handlerGobackClick,

   




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})