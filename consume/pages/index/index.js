import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import onShareAppMessage from "../../../utils/onShareAppMessage";
import getHeader from "../../../utils/getHeader";
import {formatTime} from "../../../utils/timeUtils";

const app = getApp();
const requestUtils = require("../../../utils/requestUtils");
const apiPrefix = `${app.globalData.apiUrl}/`;
const header = getHeader("urlencoded", app.globalData.token);
const SRC_LIST = {
  'catering' : '../../assets/icons/catering.svg',
  'shopping' : '../../assets/icons/shopping.svg',
  'showering': '../../assets/icons/showering.svg',
}


Page({

    /**
     * 页面的初始数据
     */
    data: {
      nowDate:'',
      list: [],
      index: 0,
      isShowLoading: false,
      isRefresh: false,
      isAllRecords: false,
      SRC_LIST
    },

    // 检查是否为第一次使用
    checkFirstRefer() {
        return (!typeof wx.getStorageSync('isFirstUseConsume') === 'boolean' && wx.setStorageSync('isFirstUseConsume',false))
          ||
          (this.fetchData('1', res => {
            this.setData({list: res});
          }) && this.data.list.length);
    },

    //触发爬虫
    triggerSpider(mode) {
      requestUtils.doPOST(`${apiPrefix}/pay/expense/fetch?mode=${mode}`,{},header)
    },

    //拉取数据库
    fetchData(index, callback) {
      requestUtils.doGET(`${apiPrefix}/pay/expense?index=${index}&startTime=2021-10-1 00:00:00&endTime=${this.data.nowDate} 23:59:59`,{},header).then(res => {
        let records = res.data.data.records
        records.forEach(item => {
          item.amount = item.amount.toFixed(2);
          item.ts = item.ts.replace('+08:00','')
          item.ts = item.ts.replace('T', ' ')
          item.ts = item.ts.replace(/\d{4}-/g,'')
          item.ts = item.ts.replace(/-/g,'/')
          if(item.address.indexOf('食堂') !== -1) item.category = 'catering'
          else if(item.address.indexOf('浴室' !== -1)) item.category = 'showering'
          else item.category = 'shopping'
        })
        callback(records)
      })
    },

    //拉取下一页
    getNextPage() {
      if(!this.data.isAllRecords) {
        this.fetchData(this.data.index + 1, res => {
          if(res.length) {
            this.setData({
              list: this.data.list.concat(res),
              index: ++this.data.index
            })
          }else this.setData({isAllRecords: true})
        })
      }
    },

    //刷新
    refresh() {
      this.setData({isRefresh: true})
      this.triggerSpider('2');
      this.setData({isShowLoading: true})
      setTimeout(() => {
        this.fetchData('1', res => {
          this.setData({isShowLoading: false})
          res.length
            ? this.setData({list: res})
            : wx.showModal({
              title: '提示',
              content: '是不是未产生消费呢?\n(或许过几分钟来看?)',
              showCancel: false,
            })
        })
      }, 10000)
      this.setData({isRefresh: false})
    },

    handlerGohomeClick,
    handlerGobackClick,
    onShareAppMessage,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.setData({nowDate: formatTime(new Date())})
      this.checkFirstRefer()
        ? (() => {
          this.triggerSpider('1');
          this.setData({isShowLoading: true})
          setTimeout(() => {
            this.fetchData('1', res => {
              this.setData({isShowLoading: false})
              res.length
                ? this.setData({list: res})
                : wx.showModal({
                  title: '提示',
                  content: '是不是未产生消费呢?\n(或许过几分钟来看?)',
                  showCancel: false,
                })
            })
          }, 10000)
          this.triggerSpider('2')
        })()
        : (() => {
            wx.showLoading({
              title: '加载中2333~',
              mask: true
            })
            this.fetchData('1', res => {
              this.setData({list: res})
              wx.hideLoading();
            })
            this.triggerSpider('2');
          })()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    // onReady: function () {
    //
    // },

    /**
     * 生命周期函数--监听页面显示
     */
    // onShow: function () {
    //
    // },

    /**
     * 生命周期函数--监听页面隐藏
     */
    // onHide: function () {
    //
    // },

    /**
     * 生命周期函数--监听页面卸载
     */
    // onUnload: function () {
    //
    // },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    // onPullDownRefresh: function () {}
    // ,

    /**
     * 页面上拉触底事件的处理函数
     */
    // onReachBottom: function () {
    //
    // },

    /**
     * 用户点击右上角分享
     */
})
