// 返回按钮触发事件
function handlerGobackClick() {
    console.log("返回！");
    wx.navigateBack({
        delta: 1
    });
}

// 回到主页
function handlerGohomeClick() {
    wx.switchTab({
        url: '/pages/index/index',
        success: (result) => {
            console.log("滚回主页！");
        },
        fail: () => { },
        complete: () => { }
    });
}

module.exports = {
    handlerGobackClick: handlerGobackClick,
    handlerGohomeClick: handlerGohomeClick
}