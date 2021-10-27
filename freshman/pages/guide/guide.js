// freshman/pages/guide/guide.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import onShareAppMessage from "../../js/onShareAppMessage";
import { campuses, fengxianPositions, fengxianDormitories, carPoints } from "./mapData";

// 启用微信定位, 以显示当前位置
const getLocation = () => wx.getLocation({
  // type: 'gcj02',//默认wgs84
  fail: () => wx.getSetting({
    success(res) {
      if (!res.authSetting["scope.userLocation"]) {
        wx.showModal({ // 用户未授权
          content: "我们需要获取位置信息, 以显示您的位置",
          confirmText: "好的",
          success: res => res.confirm && wx.openSetting()
        })
      } else {
        wx.showModal({ // 用户已授权，但是位置获取失败，提示用户去系统设置中打开定位
          content: "请在系统设置中打开定位服务",
          showCancel: false
        })
      }
    }
  })
});

Page({

  data: {
    campus: "",
    showCarRoute: "显示短驳车",
    // locationChange: false,
    setting: {
      latitude: '',
      longitude: '',
      scale: 17,
      rotate: 10,
      showLocation: true,
      enablePoi: false,
    },
    markers: [],
    polyline: [],
  },

  handlerGohomeClick,
  handlerGobackClick,
  onShareAppMessage,

  // onLoad(options: { campus: String,  })
  onLoad(options) {

    "campus" in options &&
    this.setData({ campus: options.campus });

    // 加载默认 Markers
    let markers = [];
    if (options.campus === "奉贤校区") {

      console.groupCollapsed("地点数据");

      fengxianPositions.forEach(point => {
        console.log("Const point = ", point);
        const {id, name, iconPath, latitude, longitude} = point;
        markers.push({
          id, iconPath,
          latitude, longitude,
          label: { content: name },
          width: 28, height: 30,
          alpha: 0.75,
          joinCluster: true
        });
      });
      console.groupEnd();

    }

    let target = null;

    // 加载当前宿舍楼位置
    switch (options.campus) {

      case "奉贤校区":
        if ("building" in options) {
          // 有宿舍楼，将地图中心设置为宿舍楼位置
          target = fengxianDormitories[ options.building.replace("号楼", "") ];
        } else {
          target = campuses.fengxian;
        }
      break;
      case "徐汇校区":
        target = campuses.xuhui;
        this.setData({ "setting.enablePoi": true });
      break;
      case "长桥校区":
        target = campuses.changqiao;
        this.setData({ "setting.enablePoi": true, "setting.scale": 19 });
      break;
      case "梅陇校区":
        target = campuses.meilong;
        this.setData({ "setting.enablePoi": true, "setting.scale": 19 });
      break;

      default:
        console.warn("无法获取校区信息, 使用默认奉贤校区目标点");
        target = campuses.fengxian;
      break;

    }

    console.log("当前目标点: ", target);
    const {longitude, latitude, name} = target;

    // 添加校区或宿舍楼的点位
    markers.push({
      id: 0,
      iconPath: "/freshman/assets/icons/red_arrow.png",
      joinCluster: true,
      width: 50, height: 50,
      longitude, latitude,
      label: { content: target.name }
    });

    // 设置 this.jumpToApp()
    this.jumpToApp = () => wx.openLocation({
      latitude, longitude, name, address: name, scale: 17
    });

    let context = wx.createMapContext('campusMap', this);

    // 将地图中心点设置为宿舍楼
    context.moveToLocation({ latitude, longitude });

    // 设置标记点. 注意, 通过 context 设置标记点可能无法在开发者工具上显示
    // Issue: https://developers.weixin.qq.com/community/develop/doc/0000c2af4d83102bcd3b3535c56000
    console.log("设置标记点: ", markers);
    context.addMarkers({
      markers,
      fail: err => console.error("addMarkers():", err)
    });

    // 获取用户位置
    getLocation();

  },

  showCarRoute() {
    if (this.data.showCarRoute === "显示短驳车") {
      this.setData({
        showCarRoute: "隐藏短驳车",
        polyline: [{ points: carPoints, color: "#ff9900", width: 4 }]
      })
    } else {
      this.setData({ showCarRoute: "显示短驳车", polyline: [] })
    }
  },

  jumpToApp() {},

  toNowLocation() {},

  backToSchool() {
    // 未完成
    /* const coordinate = [];
    this.setData({
      "setting.latitude": coordinate[0].latitude,
      "setting.longitude": coordinate[0].longitude,
      locationChange: false
    }); */
  }

})
