module.exports = {
  // 返回按钮
  handlerGobackClick: () => wx.navigateBack({ delta: 1 }),
  // 回到主页按钮
  handlerGohomeClick: () => wx.switchTab({ url: "/pages/index/index" })
};
