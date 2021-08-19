// pages/debug/debug.js

import onShareAppMessage from "../../utils/onShareAppMessage";
import { getAllStorageAsObject } from "../../utils/storage";
import copyText from "../../utils/copyText";

const app = getApp();

Page({

	data: {
		globalData: "",
		storage: "",
		systemInfo: ""
	},

	onShareAppMessage,

	clearStorage(e) {

		const clearStorageAndToast = title => wx.clearStorage({
			success: () => wx.showToast({ title })
		});

		wx.showModal(
			({
				some: {
					title: "是否清理本地数据",
					content: "确定要清理本地数据吗？",
					success: () => {
						const keyMap = new Map(
							[ "uid", "token", "verified", "userInfo" ].map(
								key => [ key, wx.getStorageSync(key) ]
							)
						);
						clearStorageAndToast("已清理本地数据");
						keyMap.forEach(
							(data, key) => wx.setStorageSync(key, data)
						);
					}
				},
				all: {
					title: "是否清空本地数据",
					content: "清空后，再次进入小程序时需要重新登录。确定要清空吗？",
					success: () => clearStorageAndToast("已清空本地数据")
				}
			})[e.target.dataset.clear]
		);

	},

	copy(e) {
		copyText(this.data[e.target.dataset.name]);
	},

	onLoad() {

		const has = (array, value) => array.some(item => item === value);

		const is = {
			api: (key, value) => (
				has([ "apiUrl", "commonUrl" ], key) ||
				value.includes("kite.sunnysab.cn")
			),
			token: (key, value) => (
				key === "token" &&
				value !== ""
			),
			userInfo: (key, value) => (
				has([ "userInfo", "contact" ], key) &&
				JSON.stringify(value) !== "{}"
			),
			userDetail: (key, value) => (
				has([ "userDetail", "classmates", "roommates", "familiar" ], key) &&
				value !== null
			)
		};

		const removeToken =
			app.globalData.isDev
			? null
			: (key, value) => (
				is.api(key, value) ||
				is.token(key, value) ||
				is.userInfo(key, value) ||
				is.userDetail(key, value)
				? "[已隐藏]"
				: value
			);

		const stringify = (data, replacer = null) => JSON.stringify(data, replacer, 2);

		this.setData({
			globalData: stringify(app.globalData, removeToken),
			storage:    stringify(getAllStorageAsObject(), removeToken),
			systemInfo: stringify(wx.getSystemInfoSync())
		});

	},

	// onReady() {},
	// onShow() {}

})