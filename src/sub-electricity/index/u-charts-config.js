
const formatter = num => (
	typeof num === "number"
		? num.toFixed(1).replace(".0", "")
		: num
);

export default {
	type: "line", loadingType: 4, fontSize: 12, tapLegend: true,
	disableScroll: true, // enableScroll: true,
	animation: true, timing: "easeOut", duration: 250,
	dataPointShape: true, dataPointShapeType: "solid", enableMarkLine: true,
	xAxis: { calibration: true, disableGrid: true, itemCount: 8 },
	yAxis: {
		gridType: "dash", showTitle: true, formatter, data: [{
			textAlign: "left", title: "元", titleOffsetX: -18, min: 0, formatter
		}]
	},
	legend: { show: false }
};
