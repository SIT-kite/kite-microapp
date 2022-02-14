const path = "main/pages/index/index";

const titles = {
	default: "上应小风筝 - 便利校园，一步到位",
	timetable: "用上应小风筝，无广告零干扰看课表！",
	electricity: "用上应小风筝查电费，支持用电排名和历史！"
};

// 按照 title 获取分享函数
// getOnShare(title): () => { title, path }
export function getOnShare(title) {
	return () => { title, path };
}

const timetable = getOnShare(titles.timetable);
const electricity = getOnShare(titles.electricity);
export { timetable, electricity };

// 默认分享函数
// onShareAppMessage(): { title, path }
export default getOnShare(titles.default);
