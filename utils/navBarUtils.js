// 返回按钮触发事件
var handlerGobackClick = function () {
    wx.navigateBack({
        delta: 1
    });
}

// 回到主页
var handlerGohomeClick = function () {
    wx.switchTab({
        url: '/pages/index/index',
        success: (result) => {
        },
        fail: () => { },
        complete: () => { }
    });
}

module.exports = {
    handlerGobackClick: handlerGobackClick,
    handlerGohomeClick: handlerGohomeClick
}