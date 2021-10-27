// electricity/pages/index/index.js
// https://github.com/SIT-Yiban/kite-server/blob/develop/docs/APIv1/消费查询.md

// TODO: 应该只剩下切换一周/一天用电历史没支持了
import { check, isNonEmptyString } from "../../../utils/type";
import request   from "../../../utils/request";
import getHeader from "../../../utils/getHeader";
import uCharts from "./u-charts";
import { getDateTime } from "../../../utils/timeUtils";

const app = getApp();
const gData = app.globalData;

const { platform, pixelRatio } = wx.getSystemInfoSync();

const electricityAPI = ({api = "", roomId, callback}) => request({
  url: `${gData.apiUrl}/pay/room/${roomId}${api !== "" ? "/" + api : ""}`,
  header: getHeader("urlencoded", gData.token)
}).then(
  callback
).catch(
  err => {
    console.error(err);
    wx.showModal({
      title: "发生错误",
      content: `错误信息：${ request.getMsg(err) }`,
      showCancel: false
    })
  }
);

const numberStringFilter = str => str
  .split("")
  .filter( char => "1234567890".includes(char) )
  .join("")
  .replace(/^0+(.+)/, "$1");

Page({

	data: {

    focus: false,
    loading: false,
    showResult: false,
    currentTab: 0,

    // https://developers.weixin.qq.com/community/develop/doc/00066c12e1cb90d9865a4eea455400
    canvas2d: ["android", "ios"].some( mobile => platform === mobile ),

    building: "",
    room: "",

    electricity: null,
    rank: null,
    currentRange: "days",
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

  showHint(e) {
    wx.showModal({
      title: "提示",
      content: e.target.dataset.content,
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
        this.getBill("days", roomId).then(
          () => this.renderChart(this.data.days)
        )

      ]).then(
        () => this.setData({ showResult: true, loading: false })
      );

    }
  },

  // 用电历史
  getBill(range, roomId) {

    const { datetimeName, trim } = (() => {
      switch (range) {
        case "days": return {
          datetimeName: "date", // 2021-06-09 -> 6/9
          trim: date => date.replace(/^\d\d\d\d-0?(\d\d?)-0?(\d\d?)$/, "$1/$2")
        };
        case "hours": return {
          datetimeName: "time", // 2021-06-09 15:00 -> 15:00
          trim: time => time.replace(/^.+ /, "")
        };
        default: return { datetimeName: false };
      }
    })();

    if (datetimeName === false) throw "range is not days or hours";
    else return electricityAPI({
      api: `bill/${range}`, roomId,
      callback: res => {

        const entries = res.data.data;
        console.log("用电历史", range, entries);

        const categories = [];
        const consumptions = [];
        const charges = [];
        let sum = 0;

        entries.forEach(
          entry => {
            const { consumption, charge } = entry;
            const datetime = entry[datetimeName];
            categories.push(trim(datetime));
            consumptions.push(consumption.toFixed(2));
            charge !== 0 && charges.push({ datetime, charge });
            sum += consumption;
          }
        );

        const billData = {
          [range]: {
            categories,
            series: [{ name: "电费 (元)", data: consumptions }],
            sum: sum.toFixed(2),
            median: (sum / consumptions.length).toFixed(2)
          }
        }

        if (charges.length > 0) {
          billData.charges = charges;
        }

        this.setData(billData);

      }
    });

  },

  chart: null,
  renderChart({categories, series, median}) {

    const { canvas2d } = this.data;
    const fields = { id: true, size: true };
    fields[ canvas2d ? "node" : "context" ] = true;

    wx.createSelectorQuery().select("#canvas").fields(
      fields, res => {

        const { id: canvasId, width, height, node, context } = res;
        const formatter = num =>
          typeof num === "number"
          ? num.toFixed(1).replace(".0", "")
          : num;

        this.chart = new uCharts({
          type: "line", loadingType: 4, fontSize: 12, tapLegend: true,
          disableScroll: true, enableScroll: true,
          animation: true, timing: "easeOut", duration: 250,
          canvasId, canvas2d, context: canvas2d ? node.getContext("2d") : context,
          pixelRatio, width: width - 6, height,
          dataPointShape: true, dataPointShapeType: "solid", enableMarkLine: true,
          xAxis: { calibration: true, disableGrid: true, itemCount: 8 },
          yAxis: {
            gridType: "dash", showTitle: true, formatter, data: [{
              textAlign: "left", title: "元", titleOffsetX: -18, min: 0, formatter
            }]
          },
          legend: { show: false },
          extra: {
            markLine: {
              type: "dash",
              data: [{
                value: median,
                lineColor: "#03A9F4",
                showLabel: true,
                labelBgOpacity: .5
              }]
            },
          },
          categories,
          series
        });

        // this.chart.updateData({ categories, series });

      }
    ).exec();

  },

  changeRange(e) {
    const range = e.detail.value ? "days" : "hours";
    const cachedData = this.data[range];
    const updateData = () => {
      this.chart.updateData(this.data[range]);
      this.setData({ currentRange: range });
    };
    if (Array.isArray(cachedData) && cachedData.length > 0) {
      updateData();
    } else {
      this.getBill(range, this.data.electricity.room).then(updateData);
    }
  },

  switchTab(e) {
    this.setData({ currentTab: e.target.dataset.current });
  },

  swiperChange(e) {
    this.setData({ currentTab: e.detail.current });
  },

  touchStart(e) {
    this.chart.scrollStart(e);
  },

  touchMove(e) {
    this.chart.scroll(e);
  },

  touchEnd(e) {
    this.chart.scrollEnd(e);
    this.chart.showToolTip(e/* , {
      formatter: (item, category) => category + ' ' + item.name + ':' + item.data
    } */);
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
    this.getElectricity().then(
      () => wx.stopPullDownRefresh()
    );

	},

  onShareAppMessage: () => ({
    title: "试试用上应小风筝查电费吧！支持用电排名和历史！",
    path: "pages/index/index"
  })

})
