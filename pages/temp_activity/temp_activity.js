// pages/temp_activity/temp_activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
go_in:function(res){
  let info = res; 
  if (info.detail.userInfo) {
    console.log(info.detail.userInfo);
    wx.login({
      success: function (res) {
        console.log(res);
        wx.navigateTo({
          url: '/pages/Student_system/Student_system',
          success:function(){
            console.log("success")
          }, //接口调用成功的回调函数
          fail:function(){}, //接口调用失败的回调函数
          complete:function(){} //接口调用结束的回调函数（调用成功、失败都会执行）
        })
      }
    })
  } else {
    console.log("点击了拒绝授权");
  }　　
}
})