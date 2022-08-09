// 主页

import { hasOwn, isNonEmptyString } from "../../../js/type";
import onShareAppMessage from "../../../js/onShareAppMessage";
import getHeader from "../../../js/getHeader";

import modules from "./modules";

const app = getApp();
const gData = app.globalData;

Page({

	data: {
		customNavHeight: gData.customNavHeight,
		isLogin: gData.isLogin,
		showAPP: true,
		clicked: -1, // 被点击功能的索引
		notices: [{ id: 1, title: "正在加载通知…" }],
		modules
	},

	onShareAppMessage,

	onLoad() {

		// 获取并设置通知 notice；目前不对其检查错误代码，所以直接用 wx.request()
		wx.request({
			url: `${gData.apiUrl}/notice`,
			header: getHeader("urlencoded", gData.token),
			success: res => this.setNotice(res.data.data),
			fail: err => {
				console.error(err);
				this.setData({
					notices: [{ id: -1, title: "发生网络问题，通知获取失败，请联系开发者" }]
				});
			}
		});

		const showAPP = wx.getStorageSync("showAPP");
		if (showAPP !== "") {
			gData.showAPP = showAPP;
			this.setData({ showAPP });
		}

	},

	onShow() {

		// 如果页面属性与全局属性不一致，则从全局同步到页面
		[ "isLogin", "showAPP" ].forEach(
			key => (
				hasOwn(gData, key) &&
				this.data[key] !== gData[key] &&
				this.setData({ [key]: gData[key] })
			)
		);

	},

	/* goTemp() {
		wx.navigateTo({
			url: "/freshman/pages" + (
				gData.userDetail !== null
					? "/stuInfoDetail/stuInfoDetail"
					: "/welcome/welcome"
			)
		});
	}, */

	// setNotice(notices: Array)
	setNotice(notices) {

		const noNotice = () => {
			const title = "暂无通知";
			this.setData({ notices: [{ id: -1, title }] });
			console.log(title);
		};

		if (Array.isArray(notices)) {

			if (notices.length > 0) {
				this.setData({ notices });
				console.groupCollapsed("通知数据");
				notices.forEach(notice => console.log(notice));
				console.groupEnd();
			} else {
				noNotice();
			}

		} else {
			console.error("notice is not an Array", notices);
			noNotice();
		}

	},

	// showNotice(e.target.dataset: { id: Number })
	// 点击通知后，按需弹出对话框，显示通知内容或通知全文
	// 目前，点击无内容的短通知不反应，要不要加个 wx.showToast()，提示一下用户？
	showNotice(e) {
		const notice = this.data.notices.find(
			item => item.id === e.target.dataset.id
		);
		if (notice !== undefined) {
			const noticeModal = (title, content) => wx.showModal({
				title, content, confirmText: "关闭", showCancel: false
			});
			const { title, content } = notice;
			if (isNonEmptyString(content)) {
				noticeModal(title, content); // 含内容通知
			} else if (title.length > 20) {
				noticeModal("通知详情", title); // 长通知
			}
		}
	},

	// router(e.currentTarget.dataset: { index: Number, url: String })
	router(e) {

		// dataset: { index: Number, url: String }
		const dataset = e.currentTarget.dataset;

		// 设置被点击功能索引 clicked，为图标显示点击动画；一秒后重置
		this.setData({ clicked: dataset.index });
		setTimeout(() => this.setData({ clicked: -1 }), 1000);

		const url = dataset.url;
		url && (
			// url 可用

			!gData.isLogin

				? wx.showModal({ // 未登录，提示用户登录，确定后切换到“我”
					title: "请登录",
					content: "尚未登录，请前往登录",
					confirmText: "前往",
					success: res => res.confirm && wx.switchTab({ url: "../user/user" })
				})

				: dataset.needVerify && !gData.verified

					? wx.showModal({ // 需要认证但未认证，提示用户认证，确定后导航至认证页面
						title: "需要认证",
						content: "此功能需要认证本校账号，请先认证",
						confirmText: "认证",
						success: res => res.confirm && wx.navigateTo({ url: "../verify/verify" })
					})

					: wx.navigateTo({ // 已登录，跳转到目标页面
						url, fail: () => wx.showModal({ // 页面跳转失败时，显示未完成
							title: "正在开发",
							content: "功能尚未完成，正在努力开发~",
							confirmText: "知道了",
							showCancel: false
						})
					})

		);

	}

});
