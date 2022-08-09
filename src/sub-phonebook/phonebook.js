// 常用电话

// TODO
//   已完成 基本框架样式、请求、缓存、30天更新、复制拨打，搜索、菜单跟随、菜单弹出
//   未完成 UI优化、搜索时标题隐藏、wx:key报警、动画优化

import onShareAppMessage from "../js/onShareAppMessage";
import getHeader from "../js/getHeader";
import request from "../js/request";

const app = getApp();

Page({

	data: {
		departments: [],   // 按部门分类的联系人数据
		showMenu: false,   // 是否显示左侧部门跳转菜单
		scrollIntoView: "" // 跳转到部门时要提供的 view id
	},

	onShareAppMessage,

	onLoad() {

		// 从 Storage 中取出联系人数据 departments 和下次更新日期 nextUpdate
		wx.getStorage({ key: "phonebook" }).then(phonebook => {

			const { departments, nextUpdate } = phonebook ?? {};

			Array.isArray(departments) && departments.length !== 0 &&
			typeof nextUpdate === "number" && nextUpdate > Date.now()
			// 数据有效且无需更新，直接显示
			? this.setData({ departments })
			// 数据无效或需要更新，获取、显示并保存
			: this.fetchData();

		}).catch(
			() => this.fetchData()
		);

	},

	fetchData() {

		request({
			url: `${app.globalData.apiUrl}/contact`,
			header: getHeader("urlencoded", app.globalData.token)
		}).then(res => {

			const departments = this.getDepartments(res.data.data.contacts);

			// 数据获取成功，将下次更新日期 date 设为 30 天后
			// 如果保存更新日期，后续每次判断时，都要加上 30 天
			// 而像这样保存下次更新的日期，就只要在保存时加这一次 30 天
			const nextUpdate = Date.now() + 2592000000; // 30 * 24 * 60 * 60 * 1000

			this.setData({ departments });
			wx.setStorageSync("phonebook", { departments, nextUpdate });

		}).catch(err => {

			const title = "常用电话数据获取失败";
			console.error(title, err);
			wx.showModal({
				title,
				content: `${title}，请检查网络或稍后重试。错误信息：${err}`,
				showCancel: false
			});

		});

	},

	// 将 API 返回的一维数组 contacts 转换为按部门分类的 departments
	getDepartments(contacts) {

		const departments = [];

		contacts.forEach((contact, index) => {

			contact.index = index; // 用于 wx:key
			contact.show = true;
			const name = contact.department;
			delete contact.department;

			for (const department of departments) {
				if (department.name === name) {
					// 找到部门，将 contact 加到现有 department 中
					department.contacts.push(contact);
					return;
				}
			}

			// 找不到部门，新建一个
			departments.push({ name, contacts: [contact], show: true });

		});

		return departments;

	},

	call(e) {
		let phone = e.currentTarget.dataset.phone;
		if (phone === "") {
			app.msg("电话号码为空，无法拨打");
		} else {
			if (!phone.startsWith("0")) { phone = "021" + phone; }
			wx.makePhoneCall({ phoneNumber: phone });
		}
	},

	search(e) {

		// 搜索关键词
		const value = e.detail.value;

		// 部门 departments
		const { departments } = this.data;

		departments.forEach(department => {
			if (department.name.includes(value)) {
				// 部门匹配搜索关键词，显示整个部门
				department.show = true;
				department.contacts.forEach(
					contact => contact.show = true
				);
			} else {
				let showDepartment = false;
				department.contacts.forEach(contact => {
					// 在描述和号码中搜索 value，确定联系人 contact 是否需要显示
					contact.show = (
						contact.description.includes(value) ||
						contact.phone.includes(value)
					);
					// 如果部门 department 内有任何联系人 contact 需要显示，就继续显示那个部门
					if (showDepartment === false && contact.show === true) {
						showDepartment = true;
					}
				});
				department.show = showDepartment;
			}
		});

		this.setData({ departments })
	},

	toggleMenu() {
		this.setData({ showMenu: !this.data.showMenu });
	},

	closeMenu() {
		this.data.showMenu === true &&
		this.setData({ showMenu: false });
	},

	copy(e) {
		let phone = e.currentTarget.dataset.phone;
		if (phone === "") {
			app.msg("电话号码为空，无法复制");
		} else {
			if (!phone.startsWith("0")) { phone = "021" + phone; }
			wx.setClipboardData({ data: phone });
		}
	},

	gotoDepartment(e) {
		const { index } = e.currentTarget.dataset;
		this.setData({ scrollIntoView: "department" + index });
	}

});
