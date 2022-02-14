import request   from "../js/request";
import getHeader from "../js/getHeader";

const app = getApp();

// transformations(number: number, length : number): Array
// 将数字转换为二进制转换，并返回成数组，length 可限制返回数组长度
// 返回值格式 [ 1, 0, 1, 0 ]
const transformations = (number, length) => {
  var result = [];
  for (var i = 1; i < length + 1; i++) {
    if (number & (1 << i)) {
      result.push(1);
    } else { result.push(0) }
  }
  return result;
};

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

  onLoad() {

    // getTimeOfHebdomad(Giventime: String): intervalWeek :array
    // 获得给定时间后七天的日期和星期
    // 返回格式 [{ year: yyyy, month: MM, day: dd, week: number }]
    const getTimeOfHebdomad = (givenTime) => {
      let weekday;
      let week = new Date(givenTime).getDay();
      let nowDate = givenTime;
      let newDate = 0,
        day = 0,
        year = 0,
        month = 0;
      let intervalWeek = [];
      if (week === 0) {
        week = 7;
      }
      for (let i = 0; i < 7; i++) {
        newDate = nowDate + 86400000 * i;
        newDate = new Date(newDate);
        day = newDate.getDate();
        year = newDate.getFullYear();
        month = newDate.getMonth() + 1;
        weekday = newDate.getDay();
        intervalWeek.push({ year, month, day, week: weekday });
      }
      return intervalWeek;
    };

    const dates = getTimeOfHebdomad(Date.now()).map(
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
          el => el.busyTime = transformations(el.busyTime, 11)
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
