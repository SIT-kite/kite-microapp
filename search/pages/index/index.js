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
import getHeader from "../../../utils/requestUtils.getHeader";


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
        const data = res.data.data
        // console.log(data)
        wx.setStorageSync('searchResultList', data);
        wx.navigateTo({
          url: '../mini-result/mini-result',
        })
        // console.log(data);
        // this.setData({
        //   resultList: {
        //     date: dateTime[0],
        //     time: dateTime[1].substr(0, 5),
        //     balance: data.balance.toFixed(2),
        //     power: data.power.toFixed(2)
        //   },
        //   show: true,
        //   showtype: 'normal'
        // });
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
