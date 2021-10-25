import { handlerGohomeClick, handlerGobackClick } from "../../utils/navBarUtils";
import request   from "../../utils/request";
import getHeader from "../../utils/getHeader";

const app = getApp();
const transformationsUtils = require("../../utils/transformationsUtils");
const timeUtils = require("../../utils/timeUtils");

const campusMap = new Map([
  [ "奉贤校区", { campus: 1, building: "region"   } ],
  [ "徐汇校区", { campus: 2, building: "building" } ]
]);

const getCampusAndBuilding = choosedCampus => {
  const result = campusMap.get(choosedCampus);
  if (result === undefined) {
    throw "choosedCampus is not in campusMap!";
  } else {
    return result;
  }
};

Page({
  data: {
    buildings: {
      奉贤校区: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
      徐汇校区: ["教学楼", "南图"],
    },
    campuses: ["奉贤校区", "徐汇校区"],
    weekDates: [],
    choosedCampus: "奉贤校区",
    choosedBuilding: "A",
    index: 1,
    content: []
  },

  // 导航栏函数
  handlerGohomeClick,
  handlerGobackClick,

  scroll: null,

  // 渲染开始
  onLoad() {

    const index = this.data.index;
    const {campus, building} = getCampusAndBuilding(this.data.choosedCampus);
    const weekDates = timeUtils.getTimeOfHebdomad(Date.now()).map(
      date => ["year", "month", "day"].map(key => date[key]).join("-")
    );
    let choosedDate = weekDates[0];
    this.sendData(campus, building, index, weekDates[0]);
    this.setData({ weekDates, choosedDate });

  },

  // onShow () {},

  // 发送请求
  sendData(campus, building, index, date) {

    console.log(campus, building, index, date);

    const url = new webkitURL(`${app.globalData.commonUrl}/edu/classroom/available`);
    Object.entries({
      date, index, campus, [building]: this.data.choosedBuilding
    }).forEach(
      ([key, value]) => url.searchParams.set(key, value)
    );
    const content = this.data.content;

    return request({
      url: url.href,
      header: getHeader("urlencoded", app.globalData.token),
      content
    }).then(res => {
      const rooms = res.data.data.rooms;
      if (rooms.length > 0) {
        rooms.forEach(
          el => el.busyTime = transformationsUtils.transformations(el.busyTime, 11)
        );
        this.setData({
          content: index !== 1 ? content.concat(rooms) : rooms
        });
      } else if (index === 1) {
        wx.showToast({ title: "暂无数据", icon: "none" });
        this.setData({ content: {} });
      } else {
        wx.showToast({ title: "没有更多数据了", icon: "none" });
        this.data.index -= 1;
      }
    });

  },

  // 上拉加载
  loadMore() {
    console.log("上拉加载更多");
    this.setData({ index: this.data.index + 1 });
    const {campus, building} = getCampusAndBuilding(this.data.choosedCampus);
    const {index, choosedDate} = this.data;
    this.sendData(campus, building, index, choosedDate);
  },

  // 选择时间
  tapDate (event) {
    this.setData({
      index: 1,
      choosedDate: event.currentTarget.dataset.date
    });
    const {campus, building} = getCampusAndBuilding(this.data.choosedCampus);
    const {index, choosedDate} = this.data;
    this.sendData(campus, building, index, choosedDate);
  },

  // 选择校区
  tapCampus(event) {
    const choosedCampus = event.currentTarget.dataset.campus;
    this.setData({
      choosedCampus: choosedCampus,
      choosedBuilding: this.data.buildings[choosedCampus][0],
      index: 1
    });
    const {campus, building} = getCampusAndBuilding(this.data.choosedCampus);
    const {index, choosedDate} = this.data;
    this.sendData(campus, building, index, choosedDate);
  },

  // 选择教学楼
  tapBuilding(event) {
    const choosedBuilding = event.currentTarget.dataset.building;
    this.setData({ choosedBuilding, index: 1 });
    const {campus, building} = getCampusAndBuilding(this.data.choosedCampus);
    const {index, choosedDate} = this.data;
    this.sendData(campus, building, index, choosedDate);
  },

});
