// 用户页面（我）
// pages/user/user.js

// 为方便调试，用户页面登录注册流程会全程打印日志

import onShareAppMessage from "../../../js/onShareAppMessage";
import request from "../../../js/request";
import getHeader from "../../../js/getHeader";
import promisify from "../../../js/promisify";
import loading from "../../../js/loading";


const app = getApp();
const gData = app.globalData;

const errorModal = (title, msg = "") => wx.showModal({
	title,
	content: `${title}，请检查网络或稍后重试。${msg}`,
	showCancel: false
});

const catchError = (prefix, msg, err) => {
	console.error(`${prefix} ${msg}`, err);
	errorModal(msg, `错误信息：${request.getMsg(err)}`);
}

// wxLogin(): Promise: code: String | null
// wx.login(): { code: String }
const wxLogin = () => loading({
	title: "正在登录…",
	callback: promisify(wx.login)().then(
		res => res.code
	).catch(
		err => {
			const title = "微信登录失败";
			console.error(title, err);
			errorModal(title);
			return null;
		}
	)
});

Page({

	data: {
		isLogin: gData.isLogin,
		verified: gData.verified,
		needRegister: false,
		showAPP: true
	},

	onShareAppMessage,

	// onLoad() {},
	// onReady() {},

	onShow() {
		this.data.verified !== gData.verified &&
			this.setData({ verified: gData.verified });
	},

	// setDataTo(target: [boolean, boolean, boolean], data)
	// 按需向页面变量 this.data、全局变量 globalData 和本地缓存 Storage 设置变量
	setDataTo(target, data) {
		target[0] && this.setData(data);
		target[1] && Object.assign(gData, data);
		target[2] && Object.entries(data).forEach(
			([key, value]) => wx.setStorageSync(key, value)
		);
	},

	// 向全局变量 globalData 和本地缓存 Storage 设置 uid、token、nickName 和 avatarUrl
	setUserData(data, token) { // token 不一定在 data 对象内，故单独设置参数获取
		const { uid, nickName, avatar: avatarUrl } = data;
		this.setDataTo([0, 1, 1], { uid, token, nickName, avatarUrl });
	},

	// 从服务器端 GET user identity，并设置变量 verified 和 identity
	setIdentity() {
		// GET user identity
		request({
			url: `${gData.apiUrl}/user/${gData.uid}/identity`,
			header: getHeader("urlencoded", gData.token)
		}).then(
			res => {
				this.setDataTo([0, 1, 1], { identity: res.data.data });
				this.setDataTo([1, 1, 1], { verified: true });
			}
		).catch(
			err => console.error("GET user identity 失败", err)
		);
	},

	// 向页面变量 this.data 和全局变量 globalData 设置 isLogin
	setIsLogin() {
		this.setDataTo([1, 1, 0], { isLogin: true });
	},

	// https://github.com/SIT-Yiban/kite-server/blob/master/docs/APIv1/用户模块.md
	login() {

		// PUST session
		wxLogin().then(
			wxCode => request({
				url: `${gData.apiUrl}/session`,
				method: "POST",
				header: getHeader("urlencoded"),
				data: { loginType: 0, wxCode }
			})
		).then(res => {

			console.log("POST session 登录成功", res);

			// res: { data: { code, data: { token, data: { uid, ... } } } }
			const data = res.data.data;

			// setUserData() 会向全局变量 globalData 设置 uid 和 token，
			// setIdentity() 会用到 uid 和 token，
			// 所以必须先执行 setUserData()，再执行 setIdentity()；

			// setIdentity() 会设置用户信息元素中的“已/未认证”，
			// setIsLogin()  会将用户信息元素显示出来，
			// 所以最好先执行 setIdentity()，再执行 setIsLogin()。

			this.setUserData(data.data, data.token);
			this.setIdentity();
			this.setIsLogin();

		}).catch(res => {

			// 判断是用户不存在，还是出错了
			if (request.checkCode(res, 51)) {
				// 用户不存在，准备请求授权并注册用户
				this.setData({ needRegister: true });
				wx.showModal({
					title: "需要授权",
					content: "首次使用，请再次点击按钮进行授权。",
					confirmText: "好的",
					showCancel: false
				});
			} else {
				// 出错了
				catchError("POST session", "登录失败", res);
			}

		});

	},

	// 通过 wx.getUserProfile() 授权，获取微信用户信息
	register() {

		wx.getUserProfile({
			lang: "zh_CN",
			desc: "上应小风筝需要获得您的公开信息" // 昵称和头像
		}).then(res => {

			// { nickName: String, avatarUrl: String, language: "zh_CN" }
			const data = res.userInfo;
			console.log("用户信息 userinfo:", data);

			// POST user 创建用户
			request({
				method: "POST",
				url: `${gData.apiUrl}/user`,
				header: getHeader("urlencoded"),
				data
			}).then(res => {

				console.log("POST user 用户创建成功", res);
				const data = res.data.data;

				// 新注册用户肯定没认证，所以跳过 setIdentity()
				this.setUserData(data, data.token);
				this.setIsLogin();

				// 重新获取 wxCode
				// POST user auth 创建登录渠道
				wxLogin().then(
					wxCode => request({
						url: `${gData.apiUrl}/user/${gData.uid}/authentication`,
						method: "POST",
						header: getHeader("urlencoded", gData.token),
						data: { loginType: 0, wxCode },
						complete: () => wx.hideLoading()
					}).then(
						() => console.log("POST user auth 登录渠道创建成功", res)
					).catch(
						err => catchError("POST user auth", "登录渠道创建失败", err)
					)
				);

			}).catch(
				err => catchError("POST user", "用户创建失败", err)
			);

		});

	},

	showChangelog() {
		const changelogs = new Map([
			[ ""       , "开发者工具中，版本号为空字符串…" ],
			[ "0.14.0" , "更新基础库至 2.19；小风筝 APP 发布" ],
			[ "0.14.1" , "修复课表翻页bug，更改部分图标，添加更新日志" ],
		]);
		const { version } = wx.getAccountInfoSync().miniProgram;
		wx.showModal({
			title: `当前版本 ${ version }`,
			content: changelogs.get(version) ?? "暂无更新日志",
			showCancel: false
		});
	},

	toggleAPP() {
		this.setDataTo([1, 1, 1], { showAPP: !this.data.showAPP });
	} /* ,

  // 更新用户数据
  updateUserInfo: () => wx.getUserProfile({
    lang: "zh_CN",
    desc: "上应小风筝需要获得您的公开信息"
  }).then(
    res => request({
      method: "PUT",
      url: `${gData.apiUrl}/user/${gData.uid}`,
      header: getHeader("urlencoded", gData.token),
      data: res.userInfo
    });
  )
  */

})
