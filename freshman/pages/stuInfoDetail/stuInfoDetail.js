// freshman/pages/stuInfoDetail/stuInfoDetail.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import onShareAppMessage from "../../js/onShareAppMessage";
import request   from "../../../utils/request";
import getHeader from "../../../utils/getHeader";
import loading   from "../../../utils/loading";

const app = getApp();
const gData = app.globalData;

Page({
  data: {
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

        const userDetail = res.data.data;
        this.setData({ userDetail });
        gData.userDetail = userDetail;
        wx.setStorageSync("userDetail", userDetail);

      }).catch(res => {

        console.error("新生信息获取失败", res);
        gData.userDetail = null;
        wx.setStorageSync("userDetail", null);
        wx.showModal({
          title: "新生信息获取失败",
          content: "请尝试重新提交信息；如果依旧有问题，请反馈！",
          showCancel: false,
          success: res =>
            res.confirm &&
            wx.redirectTo({ url: "/freshman/pages/welcome/welcome" })
        });

      })
    });

  },

  onShow() {
    const { navBarHeight, navBarExtendHeight } = app.globalSystemInfo;
    this.setData({
      navBarCurrentHeight: navBarExtendHeight + navBarHeight
    })
  },

  // onReady() {},

})
