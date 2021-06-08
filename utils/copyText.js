// 复制文本并 toast 提示
export function copyText(e) {
  const dataset = e.currentTarget.dataset;
  wx.setClipboardData({
    data: dataset.text,
    success: () => wx.getClipboardData({
      success: () => wx.showToast({
        title: `复制${dataset.type}成功`
      })
    })
  });
};
