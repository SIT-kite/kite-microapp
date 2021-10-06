import {
  handlerGohomeClick,
  handlerGobackClick,
} from "../../utils/navBarUtils";
import getHeader from "../../utils/getHeader";

const app = getApp();
const availableSuffix = `/edu/classroom/available`;
const requestUtils = require("../../utils/requestUtils");
const transformationsUtils = require("../../utils/transformationsUtils");
const timeUtils = require("../../utils/timeUtils");

const campuses = ["奉贤校区", "徐汇校区"];
let choosedCampus = "奉贤校区";

const buildings = {
  奉贤校区: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
  徐汇校区: ["教学楼", "南图"],
};

let choosedBuilding = "A";
let data_content = {};
let content = {};
Page({
  data: {
    campuses,
    choosedCampus,
    buildings,
    choosedBuilding,
    hideBottom: true,
    index: 1,
    content,
    data_content,
  },

  // 导航栏函数
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick,

  Choosed: function () {
    let campus;
    let building;
    if (this.data.choosedCampus == "奉贤校区") {
      (campus = 1), (building = "region");
    } else if (this.data.choosedCampus == "徐汇校区") {
      (campus = 2), (building = "building");
    }
    return [campus, building];
  },
  //发送请求
  sendData(Campus, building, index, date) {
    let _this = this;
    let available = `?campus=${Campus}&date=${date}&${building}=${this.data.choosedBuilding}&index=${index}`;
    let url = `${app.globalData.commonUrl}${availableSuffix}${available}`;
    let header = getHeader("urlencoded", app.globalData.token);
    let dataInitial = {};
    let content = _this.data.content;
    let sendData = requestUtils.doGET(url, content, header);
    let dataContent = {};
    sendData.then((res) => {
      dataInitial = res.data.data.rooms;
      dataInitial.map((el) => {
        el.busyTime = transformationsUtils.transformations(el.busyTime, 11);
      });
      index != 1
        ? (dataContent = content.concat(dataInitial))
        : (dataContent = dataInitial);
      _this.setData({
        content: dataContent,
      });
    });
  },
  //上拉加载
  loadMore() {
    let _this = this;
    console.log("上拉加载更多");
    let pages = _this.data.index;
    pages = pages + 1;
    _this.setData({
      index: pages,
    });
    _this.sendData(
      _this.Choosed()[0],
      _this.Choosed()[1],
      pages,
      _this.data.choosedDate
    );
  },
  //渲染开始
  onLoad: function (options) {
    let _this = this;
    let index = _this.data.index;
    let campus = _this.Choosed()[0];
    let building = _this.Choosed()[1];
    let today = Date.parse(new Date());
    let dates = timeUtils.getTimeOfHebdomad(today);
    let weekDates = [];
    for (let i = 0; i < dates.length; i++) {
      weekDates[i] = dates[i].year + "-" + dates[i].month + "-" + dates[i].day;
    }
    let choosedDate = weekDates[0];
    this.sendData(campus, building, index, weekDates[0]);
    this.setData({ weekDates, choosedDate });
  },

  onShow: function () {},
  //选择时间
  tapDate: function (event) {
    let _this = this;
    const date = event.currentTarget.dataset.date;
    _this.setData({
      index: 1,
      choosedDate: date,
    });
    this.sendData(
      _this.Choosed()[0],
      _this.Choosed()[1],
      1,
      this.data.choosedDate
    );
  },
  //选择校区
  tapCampus: function (event) {
    let _this = this;
    const campus = event.currentTarget.dataset.campus;
    this.setData({
      choosedCampus: campus,
      choosedBuilding: buildings[campus][0],
      index: 1,
    });
    this.sendData(
      _this.Choosed()[0],
      _this.Choosed()[1],
      1,
      _this.data.choosedDate
    );
  },
  //选择教学楼
  tapBuilding: function (event) {
    let _this = this;
    const building = event.currentTarget.dataset.building;
    _this.setData({
      index: 1,
      choosedBuilding: building,
    });
    this.sendData(
      _this.Choosed()[0],
      _this.Choosed()[1],
      1,
      _this.data.choosedDate
    );
  },
});
