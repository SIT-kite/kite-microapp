// timetable/components/daily/daily.js
let courseName = 0
Component({

	properties: {
		list: { type: Array },
	},

	data: {
		courseName
	},

	behaviors: ['wx://component-export'],

	export() {
		return this.data.courseName
	},

	methods: {
		getdata(e) {
			const data = e.currentTarget.dataset.data
			this.triggerEvent("customevent", data)
			this.setData({ courseName: data })
		},
	}

})
