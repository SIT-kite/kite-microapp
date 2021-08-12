// shop/pages/launch/launch.js
import {
  handlerGohomeClick,
  handlerGobackClick
} from '../../../utils/navBarUtils';
// pages/details.js
Page({
  
  // 导航栏函数
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick,

	/**
	 * 页面的初始数据
	 */
	data: {
		info: {
			title: "一本书",
			area: "奉贤校区",
			status: "九成新",
			time: "2021/01/01",
			contact: "QQ：1234567890",
		},
		details: "啊".repeat(1000),
		price: "12"
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

		const otherHeightSelector = '.info, .price, .details > .title';
		const pageThis = this;
		wx.getSystemInfo({
			success(res) {
				const windowHeight = res.windowHeight;
				wx.createSelectorQuery().selectAll(otherHeightSelector).fields(
					{ computedStyle: ['height'] }, function(res) {
						const otherHeight = res.map(
							_ => Number.parseInt(_.height)
						).reduce(
							(a, b) => a + b
						);
						pageThis.setData({
							detailsScrollViewHeight: windowHeight - otherHeight
						});
					}
				).exec();
			}
		})
		// const detailsScrollView = document.querySelector('.details-scroll-view');
		// console.log(detailsScrollView.style.height);
		// detailsScrollView.style.height = screenHeight;
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})