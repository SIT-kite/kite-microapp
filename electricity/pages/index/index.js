// electricity/pages/index/index.js
// https://github.com/SIT-Yiban/kite-server/blob/develop/docs/APIv1/消费查询.md

import { check, isNonEmptyString } from "../../../utils/type";
import request   from "../../../utils/request";
import getHeader from "../../../utils/getHeader";
import uCharts from "./u-charts";

const app = getApp();
const gData = app.globalData;

const electricityAPI = ({api = "", roomId, callback}) => request({
  url: `${gData.apiUrl}/pay/room/${roomId}${api !== "" ? "/" + api : ""}`,
  header: getHeader("urlencoded", gData.token)
}).then(
  callback
).catch(
  err => wx.showModal({
    content:
      err.symbol === request.symbols.codeNotZero
      ? isNonEmptyString(err.res.data.msg)
        ? err.res.data.msg
        : err.res.data.code === 200
          ? "房间不存在"
          : "发生未知错误"
      : "网络错误",
    showCancel: false
  })
);

const numberStringFilter = str => str
  .split("")
  .filter( char => "1234567890".includes(char) )
  .join("")
  .replace(/^0+(.+)/, "$1");

const dateTimeFormat = {
  format: date => date.toString()
};

Page({

	data: {
    building: "",
    room: "",
    focus: false,
    show: "",
    electricity: {},
    rank: {},
    hour: [],
    day: []
  },

  inputBuilding(e) {
    this.setData({ building: numberStringFilter(e.detail.value) });
  },

  inputRoom(e) {
    this.setData({ room: numberStringFilter(e.detail.value) });
  },

  showTip() {
    wx.showModal({
      title: "数据错误提示",
      content: "此数据来源于学校在线电费查询平台。如有错误，请以充值机显示金额为准。",
      showCancel: false
    });
  },

  getRoomId() {

    const m = content => wx.showModal({ content, showCancel: false });

    const { building, room } = this.data;

    if (building === "") {
      m("请输入楼号");
    } else if (building === "0" || Number.parseInt(building) > 26) {
      m("楼号应为 1 到 26 之间的某一个数。");
    } else if (room === "") {
      m("请输入寝室号");
    } else if (room.length < 3) {
      m("寝室号至少为 3 位；格式为层号 + 房间号，例如1楼1室的寝室号为 101。");
    } else {
      wx.setStorageSync("electricity", { building, room });
      return `10${building}${room}`;
    }

  },

  getElectricity() {

    const roomId = this.getRoomId();

    isNonEmptyString(roomId) &&
    electricityAPI({
      roomId, callback: res => {
        console.log(res);
        const { room, balance, power, ts } = res.data.data;
        this.setData({
          show: "electricity",
          electricity: {
            room, balance, power,
            datetime: dateTimeFormat.format(new Date(ts))
          }
        });
      }
    });

  },

  getHistory() {

    const roomId = this.getRoomId();

    if (isNonEmptyString(roomId)) {

      electricityAPI({
        api: "rank", roomId,
        callback: res => {
          const { consumption, rank, room_count } = res.data.data;
          this.setData({
            show: "history",
            rank: {
              consumption: consumption.toFixed(2),
              percent: (rank / room_count * 100).toFixed(2)
            }
          });
        }
      });

      electricityAPI({
        api: "bill/days", roomId,
        callback: res => {
          const data = res.data.data;
          const categories = [];
          const charges = [];
          const comsumptions = [];
          const series = [{ name: "电费", type: "line", data: [] }];

          data.some( ({charge}) => charge !== 0 ) &&
          series.unshift({ name: "充值", type: "column", data: []});

          data.forEach(
            ({ date, /* charge, */ comsumption }) => {
              categories.push(
                date.replace(/\d\d\d\d-0?(\d{1,2})-0?(\d{1,2})/, "$1/$2")
              );
              charges.push(comsumption);
              comsumptions.push(comsumption);
            }
          )
        }
      });

    }
  },

	onLoad () {

    const electricity = wx.getStorageSync("electricity");
    if ( check(electricity, "Object", { has: ["building", "room"] }) ) {

      const { building, room } = electricity;
      this.setData({ building, room });
      gData.isDev || this.getElectricity();

    } else {
      this.setData({ focus: true });
    }

    !gData.isDev &&
    wx.createSelectorQuery().select("#canvas").fields({
      id: true, size: true, node: true
    }).exec(res => {

      const { id: canvasId, width, height, node: canvas } = res[0];

      const uChart = new uCharts({
        type: "mix",
        loadingType: 4,
        canvasId,
        canvas2d: true,
        context: canvas.getContext("2d"),
        // pixelRatio: wx.getSystemInfoSync().pixelRatio,
        width, height,
        xAxis: {
          calibration: true,
          disableGrid: true
        },
        yAxis: {
          gridType: "dash",
          showTitle: true, data: [{title: "元"}]
        },
        extra: { mix: { column: { width: 4 } } },
        categories: [],
        series: []

      });

      uChart.updateData({
        categories: ["2016", "2017", "2018", "2019", "2020", "2021"],
        series: [
          { name: "充值", type: "column", data: [0, 8, 0, 0, 0, 0] },
          { name: "电费", type: "line", data: [3.5, 4, 2.5, 3.7, 4.1, 2] }
        ],
      })

    });
	},

	onReady () {

	},

	onShow () {

	},

	onPullDownRefresh () {

	},

	onShareAppMessage () {

	}
})
