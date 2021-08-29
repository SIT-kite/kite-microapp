// freshman/pages/stuInfoDetail/stuInfoDetail.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import onShareAppMessage from "../../js/onShareAppMessage";
import request   from "../../../utils/request";
import getHeader from "../../../utils/getHeader";
import loading   from "../../../utils/loading";

var app = getApp();
const requestUtils = require('../../../utils/requestUtils');

Page({
  data: {
    show: false,
    userDetail: null
  },

  handlerGohomeClick,
  handlerGobackClick,
  onShareAppMessage,

  /* unavaliableNotice: () => wx.showModal({
    title: "暂不可用",
    content: "报道指南更新中，暂不可用，敬请谅解~",
    confirmText: "知道了",
    showCancel: false
  }), */

  onLoad() {

    const gData = app.globalData;
    const { account, secret } = gData.userInfo;

    // 获取新生信息
    loading({
      title: "正在加载…",
      mask: true,

      callback: request({
        url: `${gData.apiUrl}/freshman/${account}`,
        header: getHeader("urlencoded", gData.token),
        data: { secret }
      }).then(res => {

        this.setData({ userDetail: gData.userDetail });
        app.globalData.userDetail = res.data.data;
        wx.setStorageSync("userDetail", res.data.data);

      }).catch(error => {

        console.error("新生信息获取失败", error);
        app.globalData.userDetail = null;
        wx.setStorageSync("userDetail", null);
        wx.redirectTo({ url: "/freshman/pages/welcome/welcome" });

      }).then(
        () => this.setData({ show: true })
      ).catch(
        res => wx.showModal({
          title: "哎呀，出错误了 >.<",
          content: (
            res.error === requestUtils.REQUEST_ERROR ? "业务逻辑错误"
            : res.error === requestUtils.NETWORK_ERROR ? "网络不在状态"
            : "未知错误"
          ),
          showCancel: false
        })
      )

    });

  },

  onShow() {
    const { navBarHeight, navBarExtendHeight } = getApp().globalSystemInfo;
    this.setData({
      navBarCurrentHeight: navBarExtendHeight + navBarHeight
    })
  },

  // onReady() {},

})
