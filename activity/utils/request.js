import getHeader from "../../utils/getHeader.js";

const requestUtils = require("../../utils/requestUtils");
const app = getApp();
const eventApiPrefix = `${app.globalData.apiUrl}/event`;
const header = getHeader("urlencoded", app.globalData.token);

const REQUEST_PURPOSE = ["EVENT_LIST", "EVENT_DETAIL", "EVENT_JOIN", "SCORE_SUMMARY", "SCORE_DETAIL", "EVENT_JOINED"];

const constructUrl = (requestPurpose, params) => {
  let url = eventApiPrefix;

  const [first, second, third, fourth, fifth, sixth] = REQUEST_PURPOSE;
  switch (requestPurpose) {
    case(first): {
      url += `/sc?index=${params.index}`;
      break;
    }
    case(second):{
      url += `/sc/${params.eventId}`;
      break;
    }
    case(third): {
      url += `/sc/${params.eventId}/apply?force=${params.force}`;
      break;
    }
    case(fourth): {
      url += `/sc/score/summary`
      break;
    }
    case(fifth): {
      url += `/sc/score?force=${params.force}`
      break;
    }
    case(sixth): {
      url = `${eventApiPrefix.slice(0, -5)}/${params.uid}/event?index=${params.index}`
      break;
    }
  }

  return url;
}

const fetchData =  (url, requestPurpose, callback) => {
  let getData = requestUtils.doGET(url, {}, header);
  wx.showLoading({
    title: '加载中2333~',
    mask: true
  })
  getData.then(res => {
    wx.hideLoading();
    let data;
    const [first, second, third, fourth, fifth, sixth] = REQUEST_PURPOSE;
    switch(requestPurpose) {
      case(first): {
        data = res.data.data.activityList;
        break
      }
      case(second): {
        data = res.data.data.activityDetail;
        break;
      }
      case(fourth): {
        data = res.data.data.summary;
        break;
      }
      case(fifth): {

        break;
      }
      case(sixth): {
        data = res.data.data;
        break;
      }
    }
    callback(data);
  }).catch(err => {
    wx.hideLoading();
    handleFetchListError(err);
  })
};

const submitData = (url, requestPurpose, callback) => {
  console.log(url)
  wx.showLoading({
    title: '发送中2333~',
    mask: true
  })
  let postData = requestUtils.doPOST(url, {}, header);

  postData.then(res => {
    wx.hideLoading();
    let data;
    const [first, second, third, fourth, fifth, sixth] = REQUEST_PURPOSE;
    switch(requestPurpose) {
      case (third) : {
        data = res.data;
        callback(data)
        break;
      }
    }
  }).catch(err => {
    wx.hideLoading();
    handleFetchListError(err);
  })

}

const handleFetchListError =  (err) => {
  wx.showModal({
    title: "哎呀，出错误了 >.<",
    content: err.data.code === 4
      ? "请前往小程序主页登录和认证"
      : err.data.data.result,
    showCancel: false,
    complete: err.data.code === 6
      ? () => {
          app.globalData.identity = {}
          app.globalData.verified = false
          wx.setStorageSync('verified', false)
          wx.setStorageSync('identity', {})
          wx.redirectTo({url: '/pages/verify/verify'})
        }
      : {}
      // : err.data.code === 4
      //     ? wx.switchTab({
      //         url: '/pages/index/index'
      //       })
      //     : {}
  })
}

module.exports = {
  constructUrl,
  fetchData,
  submitData,
  handleFetchListError
}

