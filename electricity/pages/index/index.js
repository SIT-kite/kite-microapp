// electricity/pages/index/index.js
// https://github.com/SIT-Yiban/kite-server/blob/develop/docs/APIv1/消费查询.md

// TODO: 应该只剩下切换一周/一天用电历史没支持了
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

const getDateTime = date => [
  [ "FullYear" , "年"  ],
  [ "Month"    , "月" , 1 ],
  [ "Day"      , "日 " ],
  [ "Hours"    , ":"   ],
  [ "Minutes"  , ":"   ],
  [ "Seconds"  , ""    ],
].map(
  ([name, suffix, offset = 0]) => `${date["get" + name]() + offset}${suffix}`
).join("");

Page({

	data: {

    show: false,
    loading: false,
    focus: false,
    current: 0,

    building: "",
    room: "",

    electricity: null,
    rank: null,
    days: null,
    hours: null,
    charges: []

  },

  inputBuilding(e) {
    this.setData({ building: numberStringFilter(e.detail.value) });
  },

  inputRoom(e) {
    this.setData({ room: numberStringFilter(e.detail.value) });
  },

  showTip() {
    wx.showModal({
      title: "提示",
      content: "数据来自学校在线电费查询平台。如有错误，请以充值机显示金额为准。",
      confirmText: "知道了",
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

    if (isNonEmptyString(roomId)) {

      this.setData({ loading: true });

      Promise[(() => {
        if ("allSettled" in Promise) {
          return "allSettled";
        } else {
          console.warn("当前运行环境不支持 Promise.allSettled()，改用 Promise.all()");
          return "all";
        }
      })()]([

        // 电费余额
        electricityAPI({
          roomId, callback: res => {
            console.log("电费余额", res.data.data);
            const { room, balance, power, ts } = res.data.data;
            this.setData({
              electricity: {
                room,
                balance: balance.toFixed(2),
                power: power.toFixed(2),
                datetime: getDateTime(new Date(ts))
              }
            });
          }
        }),

        // 消费排名
        electricityAPI({
          api: "rank", roomId,
          callback: res => {
            console.log("消费排名", res.data.data);
            const { consumption, rank, room_count } = res.data.data;
            this.setData({
              rank: {
                consumption: consumption.toFixed(2),
                percent: (rank / room_count * 100).toFixed(2)
              }
            });
          }
        }),

        // 用电历史
        electricityAPI({
          api: "bill/days", roomId,
          callback: res => {
            const data = res.data.data;
            console.log("一周历史", data);
            const categories = [];
            const charges = [];
            const consumptions = [];

            data.forEach(
              ({ date, charge, consumption }) => {
                categories.push(
                  // 2021-06-09 -> 6/9
                  date.replace(/\d\d\d\d-0?(\d{1,2})-0?(\d{1,2})/, "$1/$2")
                );
                charge !== 0 && charges.push({ date, charge });
                consumptions.push(consumption.toFixed(2));
              }
            );

            this.setData({
              days: {
                categories,
                series: [{ name: "电费 (元)", type: "line", data: consumptions }]
              }
            });

            this.renderChart(this.data.days);

            charges.length > 0 && this.setData({ charges });

          }
        })

      ]).then(
        () => this.setData({ show: true, loading: false }
      ));

    }
  },

  renderChart({categories, series}) {
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
        // dataPointShape: true,
        // dataPointShapeType: "solid",
        xAxis: {
          calibration: true,
          disableGrid: true
        },
        yAxis: {
          gridType: "dash",
          showTitle: true, data: [{title: "元"}]
        },
        extra: { mix: { column: { width: 4 } } },
        categories,
        series

      });

      uChart
      // uChart.updateData({ categories, series })

    });
  },

  switchTab(e) {
    this.setData({ current: e.target.dataset.current });
  },

  swiperChange(e) {
    this.setData({ current: e.detail.current });
  },

	onLoad() {

    const electricity = wx.getStorageSync("electricity");
    if ( check(electricity, "Object", { has: ["building", "room"] }) ) {

      // 新
      const { building, room } = electricity;
      this.setData({ building, room });
      this.getElectricity();

    } else {

      const [building, room] = ["floor", "room"].map(
        name => wx.getStorageSync(`electricity_${name}`)
      );
      if ( check(building, "Number") && check(room, "Number") ) {
        // 旧
        const electricity = { building, room };
        this.setStorageSync("electricity", electricity);
        this.setData(electricity);
        this.getElectricity();
      } else {
        // 无
        this.setData({ focus: true });
      }

    }

	},

	onReady() {

	},

	onShow() {

	},

	onPullDownRefresh() {

	},

	onShareAppMessage() {

	}
})
