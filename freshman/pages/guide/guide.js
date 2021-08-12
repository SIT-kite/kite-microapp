// freshman/pages/guide/guide.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import onShareAppMessage from "../../js/onShareAppMessage";

const defaultFengxianCenter = {
  id: 0,
  name: "奉贤校区",
  latitude: 30.842652,
  longitude: 121.509,
};

const defaultXuhuiCenter = {
  id: 0,
  name: "徐汇校区",
  latitude: 31.166975,
  longitude: 121.422453,
}

const constPositions = [{
    id: 100,
    name: '体育馆',
    latitude: 30.83989,
    longitude: 121.505344
  },
  {
    id: 101,
    name: '一食堂',
    latitude: 30.845151,
    longitude: 121.511311
  },
  {
    id: 102,
    name: '二食堂',
    latitude: 30.843024,
    longitude: 121.506793
  },
  {
    id: 103,
    name: '图书馆',
    latitude: 30.842989,
    longitude: 121.511316
  },
  {
    id: 104,
    name: '行政楼',
    latitude: 30.841071,
    longitude: 121.51101
  },
  {
    id: 105,
    name: '西南门',
    latitude: 30.83822,
    longitude: 121.50764
  },
  {
    id: 106,
    name: '南门',
    latitude: 30.840491,
    longitude: 121.512111
  },
]

const dormitoryBuildingMapping = {

  "1": {
    id: 1,
    name: '学生公寓1号楼',
    latitude: 30.845029,
    longitude: 121.512541
  },
  "2": {
    id: 2,
    name: '学生公寓2号楼',
    latitude: 30.845428,
    longitude: 121.512455
  },
  "3": {
    id: 3,
    name: '学生公寓3号楼',
    latitude: 30.845799,
    longitude: 121.512392
  },
  "4": {
    id: 4,
    name: '学生公寓4号楼',
    latitude: 30.846211,
    longitude: 121.512364
  },
  "5": {
    id: 5,
    name: '学生公寓5号楼',
    latitude: 30.846594,
    longitude: 121.512332
  },
  "6": {
    id: 6,
    name: '学生公寓6号楼',
    latitude: 30.846054,
    longitude: 121.512541
  },
  "7": {
    id: 7,
    name: '学生公寓7号楼',
    latitude: 30.845029,
    longitude: 121.511356
  },
  "8": {
    id: 8,
    name: '学生公寓8号楼',
    latitude: 30.845405,
    longitude: 121.510288
  },
  "9": {
    id: 9,
    name: '学生公寓9号楼',
    latitude: 30.845441,
    longitude: 121.510279
  },
  "10": {
    id: 10,
    name: '学生公寓10号楼',
    latitude: 30.845116,
    longitude: 121.509656
  },
  "11": {
    id: 11,
    name: '学生公寓11号楼',
    latitude: 30.844629,
    longitude: 121.509202
  },
  "12": {
    id: 12,
    name: '学生公寓12号楼',
    latitude: 30.843866,
    longitude: 121.508473
  },
  "13": {
    id: 13,
    name: '学生公寓13号楼',
    latitude: 30.84427,
    longitude: 121.508108
  },
  "14": {
    id: 14,
    name: '学生公寓14号楼',
    latitude: 30.84348,
    longitude: 121.507758
  },
  "15": {
    id: 15,
    name: '学生公寓15号楼',
    latitude: 30.843878,
    longitude: 121.507609
  },
  "16": {
    id: 16,
    name: '学生公寓16号楼',
    latitude: 30.843495,
    longitude: 121.50699
  },
  "17": {
    id: 17,
    name: '学生公寓17号楼',
    latitude: 30.841102,
    longitude: 121.506602
  },
  "18": {
    id: 18,
    name: '学生公寓18号楼',
    latitude: 30.841462,
    longitude: 121.506644
  },
  "19": {
    id: 19,
    name: '学生公寓19号楼',
    latitude: 30.841104,
    longitude: 121.505719
  },
  "20": {
    id: 20,
    name: '学生公寓20号楼',
    latitude: 30.841476,
    longitude: 121.505727
  },
  "21": {
    id: 21,
    name: '学生公寓21号楼',
    latitude: 30.841956,
    longitude: 121.505647
  },
  "22": {
    id: 22,
    name: '学生公寓22号楼',
    latitude: 30.842325,
    longitude: 121.505621
  },
  "23": {
    id: 23,
    name: '学生公寓23号楼',
    latitude: 30.841975,
    longitude: 121.504902
  },
  "24": {
    id: 24,
    name: '学生公寓24号楼',
    latitude: 30.842462,
    longitude: 121.505002
  },
  "25": {
    id: 25,
    name: '学生公寓25号楼',
    latitude: 30.846385,
    longitude: 121.513163
  },
  "26": {
    id: 26,
    name: '学生公寓26号楼',
    latitude: 30.847027,
    longitude: 121.51308
  },
}

Page({

  data: {
    locationChange: false,
    setting: {
      latitude: defaultFengxianCenter.latitude,
      longitude: defaultFengxianCenter.longitude,
      scale: 17,
      rotate: 10,
      showLocation: true,
      enablePoi: false,
    },
    markers: []
  },

  handlerGohomeClick,
  handlerGobackClick,
  onShareAppMessage,

  toNowLocation() {

  },

  backToSchool() {
    // 未完成
    const coordinate = [];
    this.setData({
      "setting.latitude": coordinate[0].latitude,
      "setting.longitude": coordinate[0].longitude,
      locationChange: false
    });
  },

  onLoad(options) {
    let markers = [];

    // 加载默认 Markers
    if(options.campus === "奉贤校区") {

      constPositions.forEach(point => {
        console.log("Const point = ", point);

        markers.push({
          id: point.id,
          joinCluster: true,
          iconPath: "/freshman/assets/icons/yellow_arrow.png",
          latitude: point.latitude,
          longitude: point.longitude,
          alpha: 0.75,
          width: 30,
          height: 30,
          label: {
            content: point.name
          }
        });
      });
    }

    let target = null;
    // 加载当前宿舍楼位置. 若为奉贤校区, 设置标记点, 并将地图中心设置为该宿舍楼位置
    if(options.campus === "奉贤校区") {
      let building_num = options.building.replace("号楼", "");
      let building_pos = dormitoryBuildingMapping[building_num];

      target = building_pos;
    } else if(options.campus === "徐汇校区") {
      target = defaultXuhuiCenter;
      this.setData({"setting.enablePoi": true})
    } else {
      console.error("无法获取校区信息, 使用默认奉贤校区目标点");
      target = defaultFengxianCenter;
    }

    console.log("当前目标点: ", target);

    // 添加宿舍楼的点位
    if(target === defaultXuhuiCenter) {
      markers.push({
        id: 0,
        iconPath: "/freshman/assets/icons/red_arrow.png",
        joinCluster: true,
        width: 50,
        height: 50,
        longitude: target.longitude,
        latitude: target.latitude,
      })
    }else {
      markers.push({
        id: 0,
        iconPath: "/freshman/assets/icons/red_arrow.png",
        joinCluster: true,
        width: 50,
        height: 50,
        longitude: target.longitude,
        latitude: target.latitude,
        label: {
          content: target.name,
        }
      })
    }


    let context = wx.createMapContext('campusMap', this);

    // 设置地图中心点为宿舍楼
    context.moveToLocation({
      longitude: target.longitude,
      latitude: target.latitude,
    });

    // 设置标记点. 注意, 通过 context 设置标记点可能无法在开发者工具上显示
    // Issue: https://developers.weixin.qq.com/community/develop/doc/0000c2af4d83102bcd3b3535c56000
    console.log("设置标记点: ", markers);
    context.addMarkers({
      markers,
      success:(res) => {
        console.log(res);
      },
      fail:(err) => {
        console.error(err);
      },
      complete:(res) => console.log("设置标记点完成: ", res),
    });

    // 启用微信定位, 以显示当前位置
    wx.getLocation({
      // type: 'gcj02',//默认wgs84
      success(location) {
        console.log(location);
      },
      fail() {
        wx.hideLoading();

        wx.getSetting({
          success(res) {
            if(!res.authSetting['scope.userLocation']) {
              wx.showModal({
                content: '我们需要获取位置信息, 以显示您的位置',
                confirmText: '好的',
                success(res) {
                  if(res.confirm) {
                    this.openSetting();
                  } else {
                    console.log('get location fail');
                  }
                }
              })
            } else {
              // 用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
              wx.showModal({
                title: '',
                content: '请在系统设置中打开定位服务',
                showCancel: false
              })
            }
          }
        })
      }
    });
  },

  // onReady() {},
  // onShow() {}

})
