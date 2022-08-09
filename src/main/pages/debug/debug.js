// pages/debug/debug.js

import onShareAppMessage from "../../../js/onShareAppMessage";
import getAllStorage from "../../../js/getAllStorage";
import request from "../../../js/request";
import getHeader from "../../../js/getHeader";
import copyText from "../../../js/copyText";
import loading from "../../../js/loading";

const app = getApp();
const gData = app.globalData;

const loginModal = () => wx.showModal({
	title: "尚未登录",
	content: "您尚未登录，请先返回并登录。",
	showCancel: false
});

Page({

	data: {
		error: "",
		globalData: "尚未获取",
		storage: "尚未获取",
		systemInfo: "尚未获取"
	},

	onShareAppMessage,

	catchError(msg, res, err) {
		this.setData({
			error:
				JSON.stringify(res) + "\n\n" +
				JSON.stringify(err)
		});
		console.error(msg, { res, err });
		wx.showModal({
			title: msg,
			content: `${msg}，已在页面上方显示错误信息。`,
			showCancel: false
		})
	},

	getUserInfo() {
		!gData.isLogin
			? loginModal()
			: request({
				url: `${gData.apiUrl}/user/${gData.uid}`,
				header: getHeader("urlencoded", gData.token)
			}).then(
				res => {
					const { nickName, avatar: avatarUrl } = res.data.data;
					Object.assign(gData, { nickName, avatarUrl });
					wx.setStorageSync("nickName", nickName);
					wx.setStorageSync("avatarUrl", avatarUrl);
					wx.showToast({ title: "获取成功" });
				},
			).catch(
				err => this.catchError("用户信息获取失败", {}, err)
			);
	},

	updateUserInfo() {
		gData.isLogin
			? loginModal()
			: wx.getUserProfile({
				lang: "zh_CN",
				desc: "上应小风筝需要获得您的公开信息"
			}).then(
				res => {
					const { nickName, avatarUrl } = res.userInfo;
					Object.assign(gData, { nickName, avatarUrl });
					wx.setStorageSync("nickName", nickName);
					wx.setStorageSync("avatarUrl", avatarUrl);
					request({
						method: "PUT",
						url: `${gData.apiUrl}/user/${gData.uid}`,
						header: getHeader("urlencoded", gData.token),
						data: res.userInfo
					}).then(
						() => wx.showToast({ title: "更新成功" })
					).catch(
						err => this.catchError("用户信息更新失败", res.userInfo, err)
					)
				}
			);
	},

	clearStorage(e) {

		const clearStorageAndToast = title => wx.clearStorage({
			success: () => wx.showToast({ title })
		});

		wx.showModal(
			({
				some: {
					title: "是否清理本地数据",
					content: "确定要清理本地数据吗？",
					success(res) {
						if (res.confirm) {
							const keyMap = new Map(
								["uid", "token", "verified", "userInfo"].map(
									key => [key, wx.getStorageSync(key)]
								)
							);
							clearStorageAndToast("已清理本地数据");
							keyMap.forEach(
								(data, key) => wx.setStorageSync(key, data)
							);
						}
					}
				},
				all: {
					title: "是否清空本地数据",
					content: "清空后，再次进入小程序时需要重新登录。确定要清空吗？",
					success: res => {
						if (res.confirm) {
							gData.isLogin = false;
							clearStorageAndToast("已清空本地数据");
						}
					}
				}
			})[e.target.dataset.clear]
		);

	},

	setDebugInfo() {

		const callback = async () => {

			const has = (array, value) => array.some(item => item === value);

			const is = {

				api: (key, value) => (
					key == "apiUrl" || (
						typeof value === "string" &&
						value.includes("kite.sunnysab.cn")
					)
				),

				token: (key, value) => (
					key === "token" &&
					value !== ""
				),
				userInfo: (key, value) => (
					has(["identity", "userInfo", "contact"], key) &&
					JSON.stringify(value) !== "{}"
				),
				userDetail: (key, value) => (
					key === "userDetail" &&
					value !== null
				),
				credentials: (key, value) => (
					["token", "userInfo", "userDetail"].some(
						credential => is[credential](key, value)
					)
				),

				timetable: (key, value) => (
					has([
						"timetableSchedule",
						"timetableCalendar",
						"contact_data"
					], key) &&
					value !== null
				)

			};

			// 隐藏 timetable；如果不在开发者工具中，则隐藏 api 和 credentials
			const removeToken = (key, value) => (
				is.timetable(key, value) ? "[长度过长，已隐藏]"
				: gData.isDev ? value
				: is.api(key, value) ? undefined
				: is.credentials(key, value) ? "[已隐藏]"
				: value
			);

			const stringify = (data, replacer = null) => (
				JSON.stringify(data, replacer, 2)
			);

			this.setData({
				globalData: stringify(gData, removeToken),
				storage: stringify(getAllStorage.asObject(), removeToken),
				systemInfo: stringify(wx.getSystemInfoSync())
			});

		};

		loading({ callback, title: "正在获取…" });

	},

	copy(e) {
		copyText(this.data[e.target.dataset.name]);
	},

	// onLoad() {},
	// onReady() {},
	// onShow() {}

})
