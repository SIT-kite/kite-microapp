// timetable/components/detail/detail.js
let courseName = "计算机文献检索及专业外语";
Component({

	properties: {
		detail: { type: Array },
	},

	data: {
		courseName,
		isShow1: false,
		isShow2: false,
	},

	methods: {
		detailAnimation1() {
			this.animation = wx.createAnimation({ duration: 300, timingFunction: "ease" });
			if (this.data.isShow1) {
				this.animation.translate(0, 0).step();
				this.setData({ animation1: this.animation.export(), isShow1: false });
			} else {
				this.animation.translate(0, -300).step();
				this.setData({ animation1: this.animation.export(), isShow1: true });
			}
		},
		detailAnimation2() {
			this.animation = wx.createAnimation({ duration: 300, timingFunction: "ease" });
			if (this.data.isShow2) {
				this.animation.translate(0, 0).step();
				this.setData({ animation2: this.animation.export(), isShow2: false });
			} else {
				this.animation.translate(0, -350).step();
				this.setData({ animation2: this.animation.export(), isShow2: true });
			}
		},
	},
	ready() { },
});
