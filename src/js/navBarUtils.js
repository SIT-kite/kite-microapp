export function navBack() { return wx.navigateBack({ delta: 1 }); }
export function navHome() { return wx.switchTab({ url: "/pages/index/index" }); }
