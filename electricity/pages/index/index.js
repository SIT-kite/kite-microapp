// electricity/pages/index/index.js
// https://github.com/SIT-Yiban/kite-server/blob/develop/docs/APIv1/消费查询.md

import { isNonEmptyString } from "../../../utils/type";
import request   from "../../../utils/request";
import getHeader from "../../../utils/getHeader";

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

const dateTimeFormat = Intl.DateTimeFormat("zh-Hans", {
  dateStyle: "long",
  timeStyle: "short"
});

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

    const h = content => wx.showModal({ content, showCancel: false });

    const { building, room } = this.data;

    if (building === "") {
      h("请输入楼号");
    } else if (building === "0" || Number.parseInt(building) > 26) {
      h("楼号应为 1 到 26 之间的某一个数。");
    } else if (room === "") {
      h("请输入寝室号");
    } else if (room.length < 3) {
      h("寝室号至少为 3 位；格式为层号 + 房间号，例如1楼1室的寝室号为 101。");
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
          electricity: {
            room, balance, power,
            datetime: dateTimeFormat.format(new Date(ts))
          },
          show: ""
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
          console.log(res);
          const { consumption, rank, room_count } = res.data.data;
          this.setData({
            rank: {
              consumption: consumption.toFixed(2),
              percent: (rank / room_count * 100).toFixed(2)
            },
            show: "history"
          });
        }
      });

    }
  },

	onLoad () {

    const electricity = wx.getStorageSync("electricity");
    if (
      typeof electricity === "object" &&
      "building" in electricity &&
      "room" in electricity
    ) {

      const { building, room } = electricity;
      this.setData({ building, room });

    } else {
      this.setData({ focus: true });
    }

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
