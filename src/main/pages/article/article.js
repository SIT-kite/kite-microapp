import onShareAppMessage from "../../../js/onShareAppMessage";

Page({

	data: { articleUrl: "" }, // "about:blank"

	onShareAppMessage,

	error: err => console.error("文章加载失败", err),

	onLoad(options) {
		this.setData({ articleUrl: options.url });
	}

});