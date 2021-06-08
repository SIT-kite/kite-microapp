// 打印并提示错误
export function catchError(res) {
  console.error(res);
  wx.showModal({
    title: "哎呀，出错误了 >.<",
    content: (
      res.error == requestUtils.REQUEST_ERROR ? res.data
      : res.error == requestUtils.NETWORK_ERROR ? "网络不在状态"
      : "未知错误"
    ),
    showCancel: false
  });
};