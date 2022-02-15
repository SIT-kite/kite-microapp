// 电费查询
// https://github.com/SIT-Yiban/kite-server/blob/develop/docs/APIv1/消费查询.md

import { electricity as onShareAppMessage } from "../../js/onShareAppMessage";
import { check, checkObject, isNonEmptyString } from "../../js/type";
import request from "../../js/request";
import getHeader from "../../js/getHeader";

import uCharts from "./u-charts";
import uChartsConfig from "./u-charts-config";
const uChartsBill = "uCharts-bill";

const getDateTime = date => [
	["FullYear", "年", 0],
	["Month", "月", 0, 1],
	["Day", "日 ", 0],
	["Hours", ":", 2],
	["Minutes", ":", 2],
	["Seconds", "", 2],
].map(
	([name, suffix, padLength, offset = 0]) => `${
		(date["get" + name]() + offset).toString().padStart(padLength, "0")
	}${suffix}`
).join("");

const app = getApp();
const gData = app.globalData;

const electricityAPI = ({ api = "", roomId, callback }) => request({
	url: `${gData.apiUrl}/pay/room/${roomId}${api}`,
	header: getHeader("urlencoded", gData.token)
}).then(
	callback
).catch(
	err => {
		console.error(err);
		wx.showModal({
			title: "发生错误",
			content: `错误信息：${request.getMsg(err)}`,
			showCancel: false
		})
	}
);

const numberStringFilter = str => str
	.split("")
	.filter(char => "1234567890".includes(char))
	.join("")
	.replace(/^0+(.+)/, "$1");

const { platform, pixelRatio } = wx.getSystemInfoSync();

Page({

	data: {

		focus: false, // 是否聚焦文本框（打开输入法）
		loading: false,
		showResult: false,
		currentTab: 0,

		building: "",
		room: "",

		// https://developers.weixin.qq.com/community/develop/doc/00066c12e1cb90d9865a4eea455400
		canvas2d: platform !== "windows",

		electricity: null,
		rank: null,
		currentRange: "days",
		days: null,
		hours: null,
		charges: []

	},

	onShareAppMessage,

	onLoad(options) {

		if (
			typeof options === "object" &&
			options !== null &&
			Object.prototype.hasOwnProperty.call(options, "tab")
		) {
			this.setData({ currentTab: options.tab });
		}

		const electricity = wx.getStorageSync("electricity");

		if (checkObject(electricity, { building: "String", room: "String" })) {

			// 新
			const { building, room } = electricity;
			this.setData({ building, room });
			this.fetchElectricity();

		} else {

			const [building, room] = ["floor", "room"].map(
				name => wx.getStorageSync(`electricity_${name}`)
			);

			if (check(building, "Number") && check(room, "Number")) {
				// 旧
				wx.setStorageSync("electricity", { building, room });
				this.setData({ building, room });
				this.fetchElectricity();
			} else {
				// 无
				this.setData({ focus: true });
			}

		}

	},

	// onReady() {},
	// onShow() {},

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

	// 电费余额
	fetchElectricity() {

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
					api: "/rank", roomId,
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
				this.fetchBill("days", roomId).then(
					() => this.renderChart(uChartsBill, this.data.days)
				)

			]).then(
				() => this.setData({ showResult: true, loading: false })
			);

		}
	},

	// 用电历史
	fetchBill(range, roomId) {

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
			api: `/bill/${range}`, roomId,
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

	renderChart(canvasId, { categories, series, median }) {

		const { canvas2d } = this.data;
		const fields = { size: true, [canvas2d ? "node" : "context"]: true };

		const markLine = {
			type: "dash",
			data: [{
				value: median,
				showLabel: true,
				// lineColor: "#03A9F4",
				// labelBgOpacity: .5
			}]
		};

		wx.createSelectorQuery().select(`#${ canvasId }`).fields(
			fields, res => {


				const canvas = res[ canvas2d ? "node" : "context" ];
				const context = canvas2d ? canvas.getContext("2d") : canvas;

				let { width, height } = res;
				if (canvas2d) {
					width *= pixelRatio;
					height *= pixelRatio;
					Object.assign(canvas, { width, height });
				}

				this.chart = new uCharts(
					Object.assign(
						uChartsConfig, {
							canvasId, canvas2d, context,
							width, height, pixelRatio: canvas2d ? pixelRatio : 1,
							categories, series, extra: { markLine }
						}
					)
				);

				// console.log(this.chart);
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
			this.fetchBill(range, this.data.electricity.room).then(updateData);
		}
	},

	switchTab(e) {
		this.setData({ currentTab: +e.target.dataset.current });
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

	onPullDownRefresh() {
		this.fetchElectricity().then(
			() => wx.stopPullDownRefresh()
		);
	}

})
