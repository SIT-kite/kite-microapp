// pages/article/article.js
Page({
  data: { articleUrl: ""/* "about:blank"  */},
  error: err => console.error("招新文章加载失败", err),
	onShareAppMessage: () => ({
    title: "小风筝招新啦！详情请见小风筝首页！",
    path: "pages/index/index"
  }),
  onLoad (options) {
    this.setData({ articleUrl: options.url })
  }
})
