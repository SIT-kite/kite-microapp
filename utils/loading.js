// loading({ title: string, mask: boolean, callback: function | Promise })
export default async ({ title, mask, callback }) => {

	wx.showLoading({ title, mask });

	// 不加括号会变成：
	// (await typeof callback === "function") ? callback() : callback;
	await (typeof callback === "function" ? callback() : callback);

	wx.hideLoading();

};
