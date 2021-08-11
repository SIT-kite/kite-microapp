// freshman/pages/guide/guide.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";

const coordinate = [
  {
    id: 1,
    name: '中心坐标',
    latitude: 30.842652,
    longitude: 121.509,
  },
  {
    id: 2,
    name: '学生公寓1号楼',
    latitude: 30.845029,
    longitude: 121.512541
  },
  {
    id: 3,
    name: '学生公寓2号楼',
    latitude: 30.845428,
    longitude: 121.512455
  },
  {
    id: 4,
    name: '学生公寓3号楼',
    latitude: 30.845799,
    longitude: 121.512392
  },
  {
    id: 5,
    name: '学生公寓4号楼',
    latitude: 30.846211,
    longitude: 121.512364
  },
  {
    id: 6,
    name: '学生公寓5号楼',
    latitude: 30.846594,
    longitude: 121.512332
  },
  {
    id: 7,
    name: '学生公寓6号楼',
    latitude: 30.846054,
    longitude: 121.512541
  },
  {
    id: 8,
    name: '学生公寓7号楼',
    latitude: 30.845029,
    longitude: 121.511356
  },
  {
    id: 9,
    name: '学生公寓8号楼',
    latitude: 30.845405,
    longitude: 121.510288
  },
  {
    id: 10,
    name: '学生公寓9号楼',
    latitude: 30.845441,
    longitude: 121.510279
  },
  {
    id: 11,
    name: '学生公寓10号楼',
    latitude: 30.845116,
    longitude: 121.509656
  },
  {
    id: 12,
    name: '学生公寓11号楼',
    latitude: 30.844629,
    longitude: 121.509202
  },
  {
    id: 13,
    name: '学生公寓12号楼',
    latitude: 30.843866,
    longitude: 121.508473
  },
  {
    id: 14,
    name: '学生公寓13号楼',
    latitude: 30.84427,
    longitude: 121.508108
  },
  {
    id: 15,
    name: '学生公寓14号楼',
    latitude: 30.84348,
    longitude: 121.507758
  },
  {
    id: 16,
    name: '学生公寓15号楼',
    latitude: 30.843878,
    longitude: 121.507609
  },
  {
    id: 17,
    name: '学生公寓16号楼',
    latitude: 30.843495,
    longitude: 121.50699
  },
  {
    id: 18,
    name: '学生公寓17号楼',
    latitude: 30.841102,
    longitude: 121.506602
  },
  {
    id: 19,
    name: '学生公寓18号楼',
    latitude: 30.841462,
    longitude: 121.506644
  },
  {
    id: 20,
    name: '学生公寓19号楼',
    latitude: 30.841104,
    longitude: 121.505719
  },
  {
    id: 21,
    name: '学生公寓20号楼',
    latitude: 30.841476,
    longitude: 121.505727
  },
  {
    id: 22,
    name: '学生公寓21号楼',
    latitude: 30.841956,
    longitude: 121.505647
  },
  {
    id: 23,
    name: '学生公寓22号楼',
    latitude: 30.842325,
    longitude: 121.505621
  },
  {
    id: 24,
    name: '学生公寓23号楼',
    latitude: 30.841975,
    longitude: 121.504902
  },
  {
    id: 25,
    name: '学生公寓24号楼',
    latitude: 30.842462,
    longitude: 121.505002
  },
  {
    id: 26,
    name: '学生公寓25号楼',
    latitude: 30.846385,
    longitude: 121.513163
  },
  {
    id: 27,
    name: '学生公寓26号楼',
    latitude: 30.847027,
    longitude: 121.51308
  },
  {
    id: 28,
    name: '体育馆',
    latitude: 30.83989,
    longitude: 121.505344
  },
  {
    id: 29,
    name: '一食堂',
    latitude: 30.845151,
    longitude: 121.511311
  },
  {
    id: 30,
    name: '二食堂',
    latitude: 30.843024,
    longitude: 121.506793
  },
  {
    id: 31,
    name: '图书馆',
    latitude: 30.842989,
    longitude: 121.511316
  },
  {
    id: 32,
    name: '行政楼',
    latitude: 30.841071,
    longitude: 121.51101
  },
  {
    id: 33,
    name: '西南门',
    latitude: 30.83822,
    longitude: 121.50764
  },
  {
    id: 34,
    name: '南门',
    latitude: 30.840491,
    longitude: 121.512111
  },
]

const markerSettings = {
  alpha:  0.6
}

//添加通用属性函数，用于统一控制大量重复控件的重复属性
const addAttribute = function(source, target){
  for(let key in source){
    target[key] = source[key]
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationChange: false,
    setting: {
      latitude: coordinate[0].latitude,
      longitude: coordinate[0].longitude,
      scale: 17,
      rotate: 10,
      showLocation: true,
    },
    markers: [{
      id: 1,
      iconPath: "/freshman/assets/icons/yellow_arrow.png",
      latitude: coordinate[27].latitude,
      longitude: coordinate[27].longitude,
      title: coordinate[27].name,
      alpha:  0.6,
      width: 30,
      height: 30,
      label: {
        content: coordinate[27].name
      }
    },
    {
      id: 2,
      iconPath: "/freshman/assets/icons/yellow_arrow.png",
      latitude: coordinate[28].latitude,
      longitude: coordinate[28].longitude,
      title: coordinate[28].name,
      alpha:  0.6,
      width: 30,
      height: 30,
      label: {
        content: coordinate[28].name
      }
    },
    {
      id: 3,
      iconPath: "/freshman/assets/icons/yellow_arrow.png",
      latitude: coordinate[29].latitude,
      longitude: coordinate[29].longitude,
      title: coordinate[29].name,
      alpha:  0.6,
      width: 30,
      height: 30,
      label: {
        content: coordinate[29].name
      }
    },
    {
      id: 4,
      iconPath: "/freshman/assets/icons/yellow_arrow.png",
      latitude: coordinate[30].latitude,
      longitude: coordinate[30].longitude,
      title: coordinate[30].name,
      alpha:  0.6,
      width: 30,
      height: 30,
      label: {
        content: coordinate[30].name,
      }
    },
    {
      id: 5,
      iconPath: "/freshman/assets/icons/yellow_arrow.png",
      latitude: coordinate[31].latitude,
      longitude: coordinate[31].longitude,
      title: coordinate[31].name,
      alpha:  0.6,
      width: 30,
      height: 30,
      label: {
        content: coordinate[31].name,
      }
    },
    {
      id: 6,
      iconPath: "/freshman/assets/icons/yellow_arrow.png",
      latitude: coordinate[32].latitude,
      longitude: coordinate[32].longitude,
      title: coordinate[32].name,
      alpha:  0.6,
      width: 26,
      height: 30,
      label: {
        content: coordinate[32].name,
      }
    },
    {
      id: 7,
      iconPath: "/freshman/assets/icons/yellow_arrow.png",
      latitude: coordinate[33].latitude,
      longitude: coordinate[33].longitude,
      title: coordinate[33].name,
      alpha:  0.6,
      width: 30,
      height: 30,
      label: {
        content: coordinate[33].name,
      }
    },
    {
      id: 8,
      iconPath: "/freshman/assets/icons/red_arrow.png",
      latitude: '',
      longitude: '',
      title: '',
      width: 50,
      height: 50,
      label: {
        content: '',
      }
    }]
  },

  toNowLocation: function() {
    this.setData({"setting.latitude": wx.getStorageSync('location').latitude})
    this.setData({"setting.longitude": wx.getStorageSync('location').longitude})
    this.setData({locationChange: true});
  },

  backToSchool: function() {
    this.setData({"setting.latitude": coordinate[0].latitude})
    this.setData({"setting.longitude": coordinate[0].longitude})
    this.setData({locationChange: false})
  },


  handlerGohomeClick,
  handlerGobackClick,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getLocation({
      // type: 'gcj02',//默认wgs84
      success: function (location) {
        wx.setStorageSync('location', location)
        console.log(location);
      },
      fail: function () {
        wx.hideLoading();
 
        wx.getSetting({
          success: function (res) {
            if (!res.authSetting['scope.userLocation']) {
              wx.showModal({
                title: '',
                content: '请允许****获取您的定位',
                confirmText: '授权',
                success: function (res) {
                  if (res.confirm) {
 
                    this.openSetting();
                  } else {
                    console.log('get location fail');
                  }
                }
              })
            }else {
              //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
              wx.showModal({
                title: '',
                content: '请在系统设置中打开定位服务',
                confirmText: '确定',
                success: function (res) {
                }
              })
            }
          }
        })
      }
    })
 
    const building = Number(wx.getStorageSync('userDetail').building.match(/\d/g).join(''))
    this.setData({"markers[7]": 
    {
      id: 8,
      latitude: coordinate[building].latitude,
      longitude: coordinate[building].longitude,
      title: coordinate[building].name,
      label: {
        content: coordinate[building].name,
      }
    }})
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