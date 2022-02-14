// pages/article/article.js

Page({

  data: { articleUrl: "" }, // "about:blank"

  error: err => console.error("文章加载失败", err),

  onLoad (options) {
    this.setData({ articleUrl: options.url })
  },

	onShareAppMessage: () => ({
    title: "小风筝招新啦！详情请见小风筝首页！",
    path: "pages/index/index"
  })

})
