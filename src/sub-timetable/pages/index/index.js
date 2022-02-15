// 课表

import { timetable as onShareAppMessage } from "../../../js/onShareAppMessage";
import { check } from "../../../js/type";
import request from "../../../js/request";
import getHeader from "../../../js/getHeader";

import { processDayCourse, processWeekCourse } from "./process";

const app = getApp();

const urlCalendar = `${app.globalData.apiUrl}/edu/calendar`;
const urlSchedule = `${app.globalData.apiUrl}/edu/schedule`;
const urlTimetable = `${app.globalData.apiUrl}/edu/timetable`;

const header = getHeader("urlencoded", app.globalData.token);

const swipeDirectionMap = new Map([
	[  1,  1 ], [ -2,  1 ],
	[ -1, -1 ], [  2, -1 ]
]);

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

// let code = false;
// let qrcodeWidth = 150;
// let codeText = "dwdwefewfw";

Page({
	data: {
		date: [],
		timetableMode: "day", // 日课表："day"，周课表："week"
		weekSlider: false, // 是否显示设置周数
		schedule: [],      // 作息时间表 schedule
		timetable: [],     //     课程表 timetable
		calendar: { year: "", semester: -1, start: ""}, // 开学时间 calendar
		oldIndex: { header: 0, day: 0, week: 0 },       // 各个 <swiper> 翻页前的页码
		pageDay: 0,
		thisWeek: 0,       // 当前周数
		startWeek: -1,
		courseDay: [],
		courseWeek: [],
		choosedDay: { week: 0 },
		toSchool: "",
		showDetail: false,
		detail: [{ courseName: "", place: "" }],
		refresh: false,
		choosedCouple: false,
		// code,
		// qrcodeWidth,
		// codeText,
	},

	onShareAppMessage,

	onLoad() {
		this.animation = wx.createAnimation({ duration: 300, timingFunction: "ease" });
		this.readStorage();
		this.fetchDataOnDemand(this.TermBegins());
	},

	// 读取缓存
	readStorage() {

		this.data.timetable = wx.getStorageSync("timetableList");
		this.data.schedule = wx.getStorageSync("timetableSchedule");
		this.setData({ calendar: wx.getStorageSync("timetableCalendar") });
		this.data.toSchool = this.data.calendar.start;

		const refresh = wx.getStorageSync("timetableRefresh");
		this.data.refresh = check(refresh, "Boolean") ? true : refresh;

		const timetableMode = wx.getStorageSync("timetableMode");
		if (timetableMode === "day" || timetableMode === "week") {
			this.setData({ timetableMode });
		} else {
			wx.setStorageSync("timetableMode", "day");
		}
	},

	// 时间判断（是否开学）
	TermBegins() {
		const toSchool = new Date(this.data.toSchool);
		return Date.now() < toSchool.getTime() ? toSchool : new Date();
	},

	// 按需判断是否接收数据
	fetchDataOnDemand(time) {
		let courseDay, courseWeek;
		if (
			["timetable", "calendar", "schedule"].every(
				key => this.data[key].length !== 0
			)
		) {
			// 判断是否有请求数据
			this.setTime(this.data.toSchool, time);
			let Data = this.processTimetable();
			[courseDay, courseWeek] = Data;
			this.setData({ courseDay, courseWeek });
		} else {
			this.fetchData(); // 请求数据
		}
	},

	// 发送请求
	fetchData() {
		wx.showLoading({ title: "加载中", mask: true });
		Promise.allSettled([
			this.fetchSchedule(), this.fetchCalendar().then(this.fetchTimetable)
		]).finally(() => wx.hideLoading());
	},

	// 请求作息表
	fetchSchedule() {
		return request({ url: urlSchedule, header }).then(res => {
			const dataSchedule = res.data.data;
			this.setData({ schedule: dataSchedule });
			wx.setStorageSync("timetableSchedule", dataSchedule);
		}).catch(this.getError);
	},

	// 请求开学时间；会返回开学时间，以便请求课表
	// calendar = { "year": "yyyy-yyyy", "semester": 1 或 2, "start": "yyyy-MM-dd" }
	fetchCalendar() {
		return request({ url: urlCalendar, header }).then(res => {
			const calendar = res.data.data;
			calendar.start = calendar.start.replace(/-/g, "/"); // 解决 iOS 日期时间解析问题

			this.setData({ calendar, toSchool: calendar.start });
			wx.setStorageSync("timetableCalendar", calendar);

			const startTime = (
				Date.now() < Date.parse(calendar.start)
					? calendar.start
					: new Date()
			);
			this.setTime(calendar.start, startTime); // 加载时间函数

			return calendar;

		}).catch(this.getError);
	},

	// 请求课表
	fetchTimetable(calendar) {
		const { year, semester } = calendar;
		request({
			url: `${urlTimetable}?year=${year}&semester=${semester}`,
			header
		}).then(res => {
			const timetable = res.data.data.timeTable;
			this.setData({ timetable });
			wx.setStorageSync("timetableList", timetable);
			const [courseDay, courseWeek] = this.processTimetable();
			this.setData({ courseDay, courseWeek });
		}).catch(this.getError);
	},

	// 报错处理方案
	getError(err) {
		wx.showModal({
			title: "请及时联系工作人员",
			content:
				err.data.code !== 1
					? err.data.msg
					: "业务逻辑出错,研究生暂不支持（＞人＜；）,认证密码可能更改",
			showCancel: false,
			complete:
				err.data.code === 6
					? () => {
						app.globalData.identity = {};
						app.globalData.verified = false;
						wx.setStorageSync("verified", false);
						wx.setStorageSync("identity", {});
						wx.redirectTo({ url: "main/pages/verify/verify" });
					}
					: () => {
						console.log("错误代码" + err.data.code);
						wx.navigateBack({ delta: 2 });
					},
		});
	},

	// 计算一周日期
	setTime(schoolHolidayDict, givenTime) {

		// console.log("setTime():", {schoolHolidayDict, givenTime});
		schoolHolidayDict = Date.parse(new Date(schoolHolidayDict));
		givenTime = Date.parse(new Date(givenTime));

		// getTimeOfWeek(Giventime: String): intervalWeek :array
		// 获得给定时间对应一周的日期和星期
		// 返回格式 [{ year: yyyy, month: MM, day: dd, week: number }]
		const getTimeOfWeek = (givenTime) => {
			if (null == givenTime) return null;
			let weekday;
			let week = new Date(givenTime).getDay();
			if (week === 0) {
				week = 7;
			}
			let nowDate = givenTime;
			let newDate = 0,
				day = 0,
				year = 0,
				month = 0;
			let intervalWeek = [];
			for (let i = 0; i < week - 1; i++) {
				newDate = nowDate - 86400000 * (week - 1 - i);
				newDate = new Date(newDate);
				day = newDate.getDate();
				year = newDate.getFullYear();
				month = newDate.getMonth() + 1;
				weekday = newDate.getDay();
				intervalWeek.push({ year, month, day, week: weekday });
			}
			for (let i = week; i < 8; i++) {
				newDate = nowDate + 86400000 * (i - week);
				newDate = new Date(newDate);
				day = newDate.getDate();
				year = newDate.getFullYear();
				month = newDate.getMonth() + 1;
				weekday = newDate.getDay();
				intervalWeek.push({ year, month, day, week: weekday });
			}
			return intervalWeek;
		};
		const date = getTimeOfWeek(givenTime).map(
			el => {
				el.weekday = "日一二三四五六"[el.week];
				if (el.week === 0) { el.week = 7; }
				return el;
			}
		);

		const oldWeek = this.data.choosedDay.week;
		let week = new Date(givenTime);
		week = oldWeek !== undefined
			? oldWeek === 0 ? 7 : oldWeek
			: week.getDay() !== 0 ? week.getDay() : 7;
		const choosedDay = { week };

		// 计算所给日期与开学的周数差

		// getIntervalToCurrentWeek(Giventime: String): intervalWeek : number
		// 获得给定时间的周数间隔（有余进一）
		// 传入格式为 时间戳
		const getIntervalToCurrentWeek = (givenTime, giveTime) => {
			let startTime = givenTime;
			var CurrentTime = giveTime;
			let intervalWeek = Math.ceil((CurrentTime - startTime) / 604800000);
			return intervalWeek;
		};
		const thisWeek = getIntervalToCurrentWeek(schoolHolidayDict, givenTime);

		// 如果未设置 startWeek，将其设为 thisWeek
		if (this.data.startWeek === -1) { this.data.startWeek = thisWeek; }

		// console.log("setTime():", { date, choosedDay, thisWeek });
		this.setData({ date, choosedDay, thisWeek });

	},

	// 转换课时时间
	tableTime(courses) {
		courses.forEach(
			course => course.table_time = ["indexOf", "lastIndexOf"].map(
				method => course.table[method](1) + 1
			)
		);
		return courses;
	},

	// 刷新函数
	refresh() {
		this.data.refresh
			? wx.showModal({
				showCancel: false,
				content:
					"一般情况下，小风筝课表会在一定天数后自动刷新。" +
					"您也可以手动点击这个按钮，以将数据同步到最新。",
				complete: () => {
					this.fetchData();
					this.data.refresh = false;
					wx.setStorageSync("timetableRefresh", this.data.refresh);
				},
			})
			: this.fetchData();
	},

	// 课表数据处理
	processTimetable(timetable = this.data.timetable) {
		let weekList = [];
		let dayList = [];
		timetable.forEach(course => {
			course.weeks = transformations(course.week, 32);
			course.table = transformations(course.timeIndex, 32);
		});
		weekList = timetable.filter( // 筛出对应周的数据
			course => course.weeks[this.data.thisWeek - 1] === 1
		);
		this.processWeek(weekList);
		dayList = weekList.filter( // 筛出对应日期的数据
			course => course.day === this.data.choosedDay.week
		);
		this.processDay(dayList);
		return [dayList, weekList];
	},

	// 周课表数据处理
	processWeek(courses) {
		courses.forEach(processWeekCourse);
	},

	// 日课表数据处理
	processDay(courses) {
		// 排序，设置标签和上课时间
		processDayCourse(courses, this.data.schedule);
	},

	// 敲击日按钮
	tapDays(e) {
		const week = e.currentTarget.dataset.week;
		this.setData({ choosedDay: { week } })
		this.setData({ courseDay: this.processTimetable()[0] });
	},

	// 敲击周课表日课表切换按钮
	tapActivity() {
		const timetableMode = this.data.timetableMode === "day" ? "week" : "day";
		this.setData({ timetableMode });
		wx.setStorageSync("timetableMode", timetableMode);
	},

	toggleWeekSlider() {
		this.setData({ weekSlider: !this.data.weekSlider });
	},

	// 时间改变函数
	changeTime(startTime, thisWeek) {
		const delta = thisWeek - this.data.startWeek;
		const givenTime = new Date(this.TermBegins().getTime() + delta * 604800000);
		this.setTime(startTime, givenTime);
	},

	// 周数设置滑块
	sliderChange(e) {
		let sliderChange = e.detail.value;
		this.changeTime(this.data.toSchool, sliderChange);
		let [courseDay, courseWeek] = this.processTimetable();
		this.setData({ courseDay, courseWeek });
	},

	// 切换周
	bindChangeWeek(e) {

		const newIndex = e.detail.current;
		const oldIndex = this.data.oldIndex.week;
		let { thisWeek } = this.data;
		const delta = swipeDirectionMap.get(newIndex - oldIndex);
		if (delta !== undefined) thisWeek += delta;
		if (thisWeek <= 0) thisWeek = 1; // 第一周到底

		this.changeTime(this.data.toSchool, thisWeek);

		let [courseDay, courseWeek] = this.processTimetable();
		this.setData({ courseDay, courseWeek, "oldIndex.week": newIndex, thisWeek });

	},

	bindChangeDay(e) {

		const newIndex = e.detail.current;
		const oldIndex = this.data.oldIndex.day;
		let thisDay = this.data.choosedDay.week;
		const delta = swipeDirectionMap.get(newIndex - oldIndex);
		if (delta !== undefined) thisDay += delta;

		this.data.choosedDay.week = thisDay;
		switch (this.data.choosedDay.week) {
			case 8:
				this.data.choosedDay.week = 1;
				this.data.thisWeek++;
				this.changeTime(this.data.toSchool, this.data.thisWeek);
				break;
			case 0:
				this.data.thisWeek--;
				this.data.thisWeek === 0 ? (this.data.thisWeek = 1) : ""; // 第一周到底
				this.changeTime(this.data.toSchool, this.data.thisWeek);
				break;
		}

		let courseDay = this.processTimetable()[0];

		this.setData({
			"oldIndex.day": newIndex,
			choosedDay: this.data.choosedDay,
			courseDay
		});

	},

	// 情侣课表扫码
	scanCode() {
		wx.scanCode({
			success(res) {
				console.log(res.result);
			},
		});
	},
	code() {
		this.setData({ choosedCouple: !this.data.choosedCouple });
	},

	collapse() {
		// 隐藏周数滑动条
		if (this.data.weekSlider === true) {
			this.setData({ weekSlider: false });
		}
		// TODO: 隐藏课程详细信息
	},

	collapseDetail() {
		if (this.data.showDetail === true) {
			this.setData({ showDetail: false });
			this.animation.translate(0, 360).step("ease");
			this.setData({ animation: this.animation.export() });
		}
	},

	getDetail(e) {
		let courses = [e.detail];
		let detail = [];
		let courseWeek = this.data.courseWeek;
		courseWeek.filter(
			_ =>
				courses[0].day === _.day &&
				courses[0].section === _.section &&
				courses[0].courseName !== _.courseName
		).forEach(
			_ => courses.push(_)
		);
		courses.forEach(
			course => detail.push(this.prepareDetailCourse(course))
		);
		// 动画判断
		let height = detail.length === 1 ? 450 : 500;
		this.animation.translate(0, this.data.showDetail ? height : -height).step();
		this.setData({
			animation: this.animation.export(),
			detail,
			showDetail: !this.data.showDetail
		});
	},

	prepareDetailCourse(e) {
		let courses = this.data.timetable.filter(el => el.courseName === e.courseName);
		courses.forEach(course => {
			// 设置上课周数、日期与时间
			const getRange = list => ["indexOf", "lastIndexOf"].map(
				method => list[method](1) + 1
			);
			course.table_time = getRange(course.table);
			const [start, end] = getRange(course.weeks);
			course.weeksday = `${start === end ? start : `${start}-${end}`}周` + // 周数
				" · " +
				`周${"日一二三四五六"[course.day]}` + // 周日期
				`(${course.table_time.join("~")}节)`; // 上课时间
			course.time = end;
		});
		// 内容整合去重
		return this.duplicateRemoval(courses);
	},

	// 去重合并
	duplicateRemoval(nameList) {
		const keys = ["courseName", "teacher", "place", "weeksday"];
		const result = {};
		keys.forEach(key => result[key] = new Set());
		nameList.map(el => keys.forEach(key => result[key].add(el[key])));
		keys.forEach(key => result[key] = Array.from(result[key]));
		result.courseId = nameList[0].courseId;
		result.dynClassId = nameList[0].dynClassId;
		return result;
	},

	popUp() {
		wx.showModal({
			cancelColor: 'cancelColor',
			showCancel: false,
			content: '当前课表只使用小程序缓存数据，刷新功能已禁用'
		})
	}

});
