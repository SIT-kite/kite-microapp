// loading.js
// wx.showLoading() 和 wx.hideLoading() 的封装
// 同时支持异步函数和 Promise

// loading({ title: string, mask: boolean, callback: function | Promise })
export default async ({ title, mask, callback }) => {

	wx.showLoading({ title, mask });

	// 这里，被 await 的东西必须加括号，如果不加括号，就会变成：
	// (await typeof callback === "function") ? callback() : callback;
	const result = await (typeof callback === "function" ? callback() : callback);

	wx.hideLoading();

	return result;

};
