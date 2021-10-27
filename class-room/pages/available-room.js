import { handlerGohomeClick, handlerGobackClick } from "../../utils/navBarUtils";
import request   from "../../utils/request";
import getHeader from "../../utils/getHeader";

const app = getApp();
const transformationsUtils = require("../../utils/transformationsUtils");
const timeUtils = require("../../utils/timeUtils");

Page({

  data: {

    // 日期 校区 教学楼 / 区域
    dates: [],
    campuses: ["奉贤校区", "徐汇校区"],
    buildings: {
      // 奉贤校区: { campus: 1, key: "building", value: ["一教", "二教"] }
      奉贤校区: { campus: 1, key: "region",   value: "ABCDEFGHI" },
      徐汇校区: { campus: 2, key: "building", value: ["教学楼", "南图"] },
    },

    choosedDate: "",
    choosedCampus: "奉贤校区",
    choosedBuilding: "A",

    index: 1,
    rooms: []

  },

  // 导航栏函数
  handlerGohomeClick,
  handlerGobackClick,

  onLoad() {

    const dates = timeUtils.getTimeOfHebdomad(Date.now()).map(
      date => ["year", "month", "day"].map(key => date[key]).join("-")
    );
    this.setData({ dates, choosedDate: dates[0] });
    this.fetchRooms();

  },

  onShow () {},

  // 发送请求
  fetchRooms(index = 1) {

    // choosedCampus 是校区名称，campus 是校区 id
    const { choosedDate: date, choosedBuilding: building } = this.data;
    const { buildings, choosedCampus } = this.data;
    const { campus, key } = buildings[choosedCampus];

    console.log({ date, campus, [key]: building, index });

    return request({
      url: `${app.globalData.commonUrl}/edu/classroom/available`,
      header: getHeader("urlencoded", app.globalData.token),
      data: { date, campus, [key]: building, index }
    }).then(res => {

      const rooms = res.data.data.rooms;

      if (rooms.length > 0) {

        // 有数据
        rooms.forEach( // 转换二进制数据
          el => el.busyTime = transformationsUtils.transformations(el.busyTime, 11)
        );
        this.setData({ // 按照获取的是否为第一页数据，更新或附加数据
          rooms: index === 1 ? rooms : this.data.rooms.concat(rooms)
        });

      } else if (index === 1) {
        // 无数据，第一页，提示 “暂无数据”，并清空 rooms
        wx.showToast({ title: "暂无数据", icon: "none" });
        this.setData({ rooms: [] });
      } else {
        // 无数据，非第一页，提示 “没有更多数据了”，并将 index 减去 1
        wx.showToast({ title: "没有更多数据了", icon: "none" });
        this.data.index -= 1;
      }

    });

  },

  // 选择日期
  tapDate(e) {
    this.setData({ choosedDate: e.target.dataset.date });
    this.fetchRooms();
  },

  // 选择校区 同时重置选中的教学楼
  tapCampus(e) {
    const choosedCampus = e.target.dataset.campus;
    const buildings = this.data.buildings;
    this.setData({ choosedCampus, choosedBuilding: buildings[choosedCampus].value[0] });
    this.fetchRooms();
  },

  // 选择教学楼
  tapBuilding(e) {
    this.setData({ choosedBuilding: e.target.dataset.building });
    this.fetchRooms();
  },

  // 上拉加载更多（下一页）
  loadMore() {
    this.fetchRooms(++this.data.index);
  },

});
