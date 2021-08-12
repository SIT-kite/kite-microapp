export default async ({ title, mask, callback }) => {
	await wx.showLoading({ title, mask });
	await callback();
	await wx.hideLoading();
};
