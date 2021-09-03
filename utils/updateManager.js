// updateManager.js

export default () => {

	// 更新版本
	const updateManager = wx.getUpdateManager();

	updateManager.onCheckForUpdate(
		res => console.log(res.hasUpdate ? "有新版本！" : "暂无新版本")
	);

	updateManager.onUpdateReady(() => {
		wx.showModal({
			title: "更新提示",
			content: "新版本已经准备好，是否重启应用？"
		}).then(res => {
			if (res.confirm) {
				// 清空本地存储；清空后用户将重新登录，新版本与旧版本存储不兼容时使用
				// wx.clearStorageSync();
				updateManager.applyUpdate();
			}
		});
	});

	updateManager.onUpdateFailed(() => {
		console.warn("新版本下载失败");
		wx.showModal({
			title: "更新提示",
			content: "新版本下载失败, 请稍后重试！",
			showCancel: false
		});
	});

};
