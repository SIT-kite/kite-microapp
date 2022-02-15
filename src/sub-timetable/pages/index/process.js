import category from "./category";

const checkCourseConflict = (x, course, courses) => {
	course.conflict = false;
	for (let i = 0; i < courses.length; i++) {
		if (
			i !== x &&
			course.day === courses[i].day &&
			course.section === courses[i].section
		) {
			course.conflict = courses[i].conflict = true;
		}
	}
};

// 设置标签和上课时间
const processDayCourse = (courses, schedule) => {

	courses.sort((a, b) => a.time_index - b.time_index);

	// 设置标签和上课时间
	courses.forEach(course => {

		// 标签
		course.category = category.get(course.courseName) ?? "general";

		// 上课时间
		const table = [
			[course.campus, "奉贤校区"], // 校区
			[course.place.slice(0, 2), "default"] // 教学楼
		].reduce(
			(table, [key, fallback]) => table[key in table ? key : fallback],
			schedule // 作息表
		);

		course.tables = ["indexOf", "lastIndexOf"].map(
			(method, index) => table[course.table[method](1)][index]
		);

	});
};

// 设置背景色、开始时间和长度，用于周视图的课程元素；
// 检查课程冲突并设置 conflict
const processWeekCourse = (course, i, courses) => {
	const getRange = time => ["indexOf", "lastIndexOf"].map(
		method => time[method](1)
	);
	const [start, end] = getRange(course.table);
	course.color = i % 9; // 背景色
	course.section = start; // 开始时间
	course.time = end - start + 1; // 长度
	checkCourseConflict(i, course, courses);
};

export {
	processDayCourse,
	processWeekCourse
}
