// app.js

import { hasOwn, isNonEmptyString } from "./js/type";
import getAllStorage from "./js/getAllStorage";
import getHeader from "./js/getHeader";

App({

	globalData: {

		apiUrl: "https://kite.sunnysab.cn/api/v1",

		isDev: false,  // 是否在微信开发者工具中
		showAPP: true, // 是否显示小风筝 APP

		customNavHeight: 0, // 自定义顶部导航栏留空高度，单位为 px

		uid: -1,   // 用户 ID
		token: "", // 登录需要的授权码

		isLogin: false,  // 是否已登录
		verified: false, // 是否已认证
		identity: {},    // 身份认证信息，含校园账号登录信息

		nickName: null, // 昵称
		avatarUrl: null, // 头像

		signPrivacyConfirm: false, // 认证隐私协议
		freshmanPrivacyConfirm: false, // 迎新隐私协议

		visible: false,   // 迎新 inputInfo 页面 复选框 同城可见
		userInfo: {},     // 迎新 inputInfo 页面 验证信息 姓名/考生号/准考证号，身份证后六位
		contact: {},      // 迎新 inputInfo 页面 联系方式 手机号 tel，qq，微信 wechat
		userDetail: null, // 迎新 stuInfoDetail 页面 用户详情

	},

	onLaunch() {

		const gData = this.globalData;
		const storage = getAllStorage.asObject();
		const systemInfo = wx.getSystemInfoSync();

		// 从本地存储 Storage 中获取重要属性，设置全局数据 globalData
		[ "uid", "token", "verified", "identity",
			"nickName", "avatarUrl", "userInfo", "userDetail",
			"signPrivacyConfirm", "freshmanPrivacyConfirm" ]
			.filter( key => hasOwn(storage, key) )
			.forEach( key => gData[key] = storage[key] );

		// 按照 uid 和 token 来判断并设置 isLogin
		gData.isLogin = (
			gData.uid > 0 &&
			isNonEmptyString(gData.token)
		);

		// 如果用户已登录但昵称或头像缺失，则获取昵称和头像
		if (
			gData.isLogin && !(
				isNonEmptyString(gData.nickName) &&
				isNonEmptyString(gData.avatarUrl)
			)
		) {
			const { nickName, avatarUrl } = gData;
			console.warn("用户已登录，但昵称或头像缺失", { nickName, avatarUrl });
			wx.request({
				url: `${gData.apiUrl}/user/${gData.uid}`,
				header: getHeader("urlencoded", gData.token),
				success: res => {
					const { nickName, avatar: avatarUrl } = res.data.data;
					Object.assign(gData, { nickName, avatarUrl });
					wx.setStorageSync("nickName", nickName);
					wx.setStorageSync("avatarUrl", avatarUrl);
				},
				fail: console.error
			});
		}

		// 设置 customNavHeight
		const { safeArea: { top: safeTop } } = wx.getWindowInfo();
		const rect = wx.getMenuButtonBoundingClientRect();
		gData.customNavHeight = rect.height + (rect.top) * 2 - safeTop;

		// 设置 isDev
		gData.isDev = systemInfo.platform === "devtools";

		// 按照 isDev 进行收尾操作
		if (gData.isDev) {
			// 打印调试信息
			console.groupCollapsed("调试信息");
			new Map([
				["全局数据 globalData", gData],
				["本地存储 storage", storage],
				["系统信息 systemInfo", systemInfo]
			]).forEach(
				(value, name) => console.log(`${name}:`, value)
			);
			console.groupEnd();
		} else {
			// 检查更新
			import("/js/updateManager").then(
				({ default: updateManager }) => updateManager()
			);
		}

	}

});
