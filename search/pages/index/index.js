// pages/index/index.js

import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import request   from "../../../utils/request";
import getHeader from "../../../utils/getHeader";
import loading   from "../../../utils/loading";

const app = getApp();
const searchSuffix = `/search/notice/?query=`;


Page({

  data: {
    content: "",
    history_content: []
  },

  onLoad() {
    const history_content = wx.getStorageSync("searchHistoryList");
    if(history_content) {
      this.setData({ history_content });
    }
  },

  inputContent(e) {
    this.setData({ content: e.detail.value });
  },

  clearContent() {
    this.setData({ content: ""});
  },

  search() {

    const content = this.data.content;

    if (content !== "") {

      wx.setStorageSync("searchKeyWord", content);
      // console.log(wx.getStorageSync("searchKeyWord"))

      const history = this.data.history_content;
      const index = history.indexOf(content);
      index !== -1 && history.splice(index, 1);
      history.unshift(content);

      this.setData({ history_content: history });
      wx.setStorageSync("searchHistoryList", history);

      loading({
        title: "正在搜索…",

        callback: async () => await request({
          url: `${app.globalData.commonUrl}${searchSuffix}${content}`,
          header: getHeader("urlencoded", app.globalData.token)
        }).then((res) => {

          let results = res.data.data;
          const text = this.data.content;

          const getInf = (str, key) => str.replace(
            new RegExp(`<b>${key}</b>`, 'g'), `%%${key}%%`
          ).split('%%');

          for (let i = 0; i < results.length; i++) {
            let result = results[i];
            result.title = getInf(result.title, text);
            result.content = result.content.replace(/\n|发布$/g, "");
            result.content = getInf(result.content, text);
          }

          wx.setStorageSync("searchResultList", results);

          wx.navigateTo({ url: "../mini-result/mini-result" });

        }).catch(
          () => wx.showModal({
            content: "找不到相关内容",
            showCancel: false
          })
        )

      })
    }
  },

  inputHistoryContent(e) {
    this.setData({ content: e.target.dataset.word });
  },

  searchHistoryContent(e) {
    this.inputHistoryContent(e);
    this.search();
  },

  clearHistoryContent() {
    wx.showModal({
      title: "是否清空搜索历史",
      content: "确定要清空搜索历史吗？",
      success() {
        wx.removeStorageSync("searchHistoryList");
        this.setData({ history_content: [] });
      }
    })
  },

  handlerGohomeClick,
  handlerGobackClick,

  onShareAppMessage: () => ({
    title: "用上应小风筝，便捷搜索全校通知公告",
    path: "pages/index/index"
  })

})
