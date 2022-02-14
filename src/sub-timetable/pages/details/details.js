Page({

	data: {
		showCourse: '高等数学',
		showTime: '12:34',
		showTutor: '魏彪',
		showLocation: '二教',
	},

	onLoad() {
		// var courseId = options.courseId;
		// console.log(courseId);

		this.setData({
			showCourse: this.data.showCourse,
			showTime: this.data.showTime,
			showTutor: this.data.showTutor
		})

	}

})
