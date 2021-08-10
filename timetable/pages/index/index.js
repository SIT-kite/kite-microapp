//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    colorArrays: [ "#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#0A9A84", "#61BC69", "#12AEF3", "#E29AAD"],
    wlist: [
      { "week_what": 1, "section_what": 1, "time": 3, "content": "高等数学@一教A-302" },
      { "week_what": 1, "section_what": 5, "time": 3, "content": "大学物理@教A-301" },
      { "week_what": 2, "section_what": 1, "time": 2,"content":"初级通用学术英语@教A-301"},
      { "week_what": 2, "section_what": 8, "time": 2, "content": "计算机网络@教A-301" },
      { "week_what": 3, "section_what": 4, "time": 1, "content": "计算机组成原理@教A-301" },
      { "week_what": 3, "section_what": 8, "time": 1, "content": "高等数学@教A-301" },
      { "week_what": 3, "section_what": 5, "time": 2, "content": "线性代数@教A-301" },
      { "week_what": 4, "section_what": 2, "time": 3, "content": "巫术@教A-301" },
      { "week_what": 4, "section_what": 8, "time": 2, "content": "高等数学@教A-301" },
      { "week_what": 5, "section_what": 1, "time": 2, "content": "羽毛球@教A-301" },
      { "week_what": 6, "section_what": 3, "time": 2, "content": "三国杀@教A-301" },
      { "week_what": 7, "section_what": 5, "time": 3, "content": "高等数学@教A-301" },
    ],




     
    
  },
  onLoad: function () {
    console.log('onLoad')
  }
})
