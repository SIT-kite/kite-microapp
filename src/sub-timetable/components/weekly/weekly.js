Component({

	properties: {
		wlist: { type: Array }
	},

	data: {
		colorArrays: [
			"rgba(251, 83, 82, 0.7)",
			"rgba(115, 123, 250, 0.6)",
			"rgba(116, 185, 255, 0.7)",
			"rgba(118, 126, 253, 0.7)",
			"rgba(245, 175, 77, 0.7)",
			"rgba(187, 137, 106, 0.7)",
			"rgba(232, 67, 147, 0.7)",
			"rgba(188, 140, 240, 0.7)",
			"rgba(116, 185, 255, 0.7)"
		],
	},

	methods: {
		getdata(e) {
			const data = e.currentTarget.dataset.data;
			this.triggerEvent("customevent", data);
			this.setData({ courseName: data });
		},
	},
});
