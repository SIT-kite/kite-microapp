// 复制文本并 toast 提示
// copyText(e: Event)
export default data => {
  wx.setClipboardData({
    data, success: () => wx.showToast({ title: "复制成功" })
  });
};
