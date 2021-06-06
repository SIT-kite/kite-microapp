// 返回按钮触发事件
const handlerGobackClick = function () {
    wx.navigateBack({
        delta: 1
    });
}

// 回到主页
const handlerGohomeClick = function () {
    wx.switchTab({
        url: '/pages/index/index',
        success: () => {},
        fail: () => {},
        complete: () => {}
    });
}

module.exports = {
    handlerGobackClick: handlerGobackClick,
    handlerGohomeClick: handlerGohomeClick
}