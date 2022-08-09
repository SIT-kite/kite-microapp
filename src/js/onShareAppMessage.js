// onShareAppMessage.js
// 封装小程序 Page() 的 onShareAppMessage() 函数

// 统一页面路径
const path = "main/pages/index/index";

// 按照统一页面路径和 title，获取分享函数
// getOnShare(title): () => { title, path }
export function getOnShare(title) {
	// onShareAppMessage(): { title, path }
	return () => { title, path };
}

// 默认分享函数
// import onShareAppMessage from "./js/onShareAppMessage";
export default getOnShare("上应小风筝 - 便利校园，一步到位");

// 定制分享函数
// import { xxx as onShareAppMessage } from "./js/onShareAppMessage";
const timetable = getOnShare("用上应小风筝，无广告零干扰看课表！");
const electricity = getOnShare("用上应小风筝查电费，支持用电排名和历史！");
export { timetable, electricity };
