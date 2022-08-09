// storage.js

// getAllStorage 系列函数
// 获取本地存储 Storage 中的所有键和值，并将其转换为数组、对象或 Map 返回
export default {
	asArray: () => (
		// 目前仅支持同步读取，性能消耗随 Storage 中键值数量增高
		// 别经常调用这两函数，也别往 Storage 里塞一大堆东西
		wx.getStorageInfoSync().keys.map(
			key => [ key, wx.getStorageSync(key) ]
		)
	),
	// asObject 和 asMap 需要访问 this，不能是箭头函数
	asObject() {
		return Object.fromEntries(this.asArray());
	},
	asMap() {
		return new Map(this.asArray());
	}
};
