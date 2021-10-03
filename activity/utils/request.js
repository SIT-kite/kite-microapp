import getHeader from "../../../utils/getHeader";

const requestUtils = require("../../../utils/requestUtils");
const app = getApp();
const eventApiPrefix = `${app.globalData.apiUrl}/event`;
const header = getHeader("urlencoded", app.globalData.token);

const REQUEST_PURPOSE = ["EVENT_LIST", "EVENT_DETAIL", "EVENT_JOIN", "SCORE_SUMMARY", "SCORE_DETAIL", "EVENT_JOINED"];

const constructUrl = function (requestPurpose, params) {
  let url = eventApiPrefix;

  const [first, second, third, fourth, fifth, sixth] = REQUEST_PURPOSE;
  switch (requestPurpose) {
    case(first): {
      url += `?index=${params.index}`;
      break;
    }
    case(second):{
      url += `/sc/score_detail?force=${params.force}`;
      break;
    }
    case(third): {
      url = `/${params.eventId}/participant`;
      break;
    }
    case(fourth): {
      url += `/sc/score`
      break;
    }
    case(fifth): {
      url += `/sc/score_detail?force=${params.force}`
      break;
    }
    case(sixth): {
      url = `${eventApiPrefix.slice(0, -5)}/${params.uid}/event?index=${params.index}`
      break;
    }
  }

  return url;
}

const fetchData = function (url, requestPurpose, callback) {
  let getData = requestUtils.doGET(url, {}, header);
  getData.then(res => {
    let data;
    const [first, second, third, fourth, fifth, sixth] = REQUEST_PURPOSE;
    switch(requestPurpose) {
      case(first): {
        data = res.data.data;
        break
      }
      case(second): {
        data = res.data.data;
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
    handleFetchListError(err);
  })
};

const submitData = function (url, requestPurpose, callback) {
  let postData = requestUtils.doPOST(url, {}, header);

  postData.then(res => {
    let code;
    const [first, second, third, fourth, fifth, sixth] = REQUEST_PURPOSE;
    switch(requestPurpose) {
      case (third) : {
        code = res.data.code;
        callback(code)
        break;
      }
    }
  }).catch(err => {
    handleFetchListError(err);
  })

}

const handleFetchListError = function (err) {

  wx.showModal({
    title: "哎呀，出错误了 >.<",
    content:
      err.data.code !== 1
        ? err.data.msg
        : "业务逻辑出错",
    showCancel: false,
    complete: err.data.code === 6
      ? () => {
        app.globalData.identity = {}
        app.globalData.verified = false
        wx.setStorageSync('verified', false)
        wx.setStorageSync('identity', {})
        wx.redirectTo({url: '/pages/verify/verify'})
      }
      : () => {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
  })
}



