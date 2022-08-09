// updateManager.js
// 小程序 UpdateManager 封装

export default () => {

	const updateManager = wx.getUpdateManager();

	updateManager.onCheckForUpdate(
		res => console.log(res.hasUpdate ? "有新版本！" : "暂无新版本")
	);

	updateManager.onUpdateReady(
		() => updateManager.applyUpdate()
	);

	updateManager.onUpdateFailed(
		() => wx.showModal({
			title: "更新提示",
			content: "上应小风筝更新失败, 请稍后重试！",
			showCancel: false
		})
	);

};
