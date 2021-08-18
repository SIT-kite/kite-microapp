// storage.js

// 获取本地存储 Storage 中的所有键和值，并将其转换为对象或 Map 返回
// 性能消耗随 Storage 中键值数量增高，别经常调用这两函数
// 也别往 Storage 里塞一大堆东西

const getAllStorageAsArray = () => (
	wx.getStorageInfoSync().keys.map(
		key => [ key, wx.getStorageSync(key) ]
	)
);

// getAllStorageAsObject(): Object
const getAllStorageAsObject = () => Object.fromEntries(getAllStorageAsArray());

// getAllStorageAsMap(): Object
const getAllStorageAsMap = () => new Map(getAllStorageAsArray());

export {
	// getAllStorageAsArray,
	getAllStorageAsObject,
	getAllStorageAsMap
}
