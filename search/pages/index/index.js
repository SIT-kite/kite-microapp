// index.js
// 获取应用实例
import {
  handlerGohomeClick,
  handlerGobackClick
} from '../../../utils/navBarUtils';

const app = getApp();
const searchSuffix = `/search/notice/?query=`;
const requestUtils = require("../../../utils/requestUtils");
const promisify = require('../../../utils/promisifyUtils');
const wxShowModal = promisify(wx.showModal);
import getHeader from "../../../utils/getHeader";


Page({
  data: {
    content: "",
    history_content: []
  },
  onLoad: function() {
    if(wx.getStorageSync('searchHistoryList')){
      this.setData({history_content: wx.getStorageSync('searchHistoryList')})
    }
  },
  inputContent: function(e) {
    this.setData({ content: e.detail.value });
  },
  clearContent: function() {
    this.setData({ content: ""});
  },
  contentConfirm: function() {
    if(this.data.content != "" ){
      wx.setStorageSync('searchKeyWord', this.data.content);
      // console.log(wx.getStorageSync('searchKeyWord'))
      var history_content = this.data.history_content;
      if(!history_content.includes(this.data.content)){
        history_content.unshift(this.data.content);
      }else {
        history_content.splice(history_content.indexOf(this.data.content),1);
        history_content.unshift(this.data.content);
      }
      this.setData({history_content: history_content});
      wx.setStorageSync('searchHistoryList', this.data.history_content);

      const content = this.data.content;
      let url = `${app.globalData.commonUrl}${searchSuffix}${content}`;
      let header = getHeader("urlencoded", app.globalData.token);
      let data = {};
      let contentConfirm = requestUtils.doGET(url, data, header);
      contentConfirm.then((res) => {

        let data = res.data.data
        const text = this.data.content
        const getInf = (str, key) => str.replace(new RegExp(`<b>${key}</b>`, 'g'), `%%${key}%%`).split('%%');
        for (let i = 0; i < data.length; i++) {
          let words = data[i];
          let title = words["title"];
          words["title"] = getInf(title, text);
        }
        for (let i = 0; i < data.length; i++) {
          let words = data[i];
          let content = words["content"];
          words["content"] = getInf(content, text);
        }

        wx.setStorageSync('searchResultList', data);
        wx.navigateTo({
          url: '../mini-result/mini-result',
        })
      }).catch(res => {
        wxShowModal({
          content: "无相关内容",
        });
      })

    }
  },
  clearHistoryContent: function() {
    wx.removeStorageSync('searchHistoryList');
    this.setData({history_content:[]});
  },
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick
})
