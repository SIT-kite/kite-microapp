// 复制文本并 toast 提示
// copyText(e: Event)
export default e => {
  const dataset = e.currentTarget.dataset;
  wx.setClipboardData({
    data: dataset.text,
    success: () => wx.showToast({
      title: `复制${dataset.type}成功`
    })
  });
};
