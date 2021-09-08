// freshman/pages/newClass/newClass.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import onShareAppMessage from "../../js/onShareAppMessage";
import { isNonEmptyString } from "../../../utils/type";
import request   from "../../../utils/request";
import getHeader from "../../../utils/getHeader";

const app = getApp();

// 请求班级同学信息并更新页面，请求出错时弹出错误提示

Page({

  data: {
    loaded: false,
    classmates: [],
  },

  handlerGohomeClick,
  handlerGobackClick,
  onShareAppMessage,

  async setClassmates() {

    const gData = app.globalData;
    const { account, secret } = gData.userInfo;
    await request({
      url: `${gData.apiUrl}/freshman/${account}/classmate`,
      header: getHeader("urlencoded", gData.token),
      data: { secret }
    }).then(
      res => this.setData({ classmates: res.data.data.classmates })
    ).catch(
      err => {
        console.error("班级同学获取失败", err);
        wx.showModal({
          title: "哎呀，出错误了 >.<",
          content: (
            err.symbol === request.symbols.codeNotZero &&
            isNonEmptyString(err.res.data.msg)
            ? `错误信息：${err.res.data.msg}`
            : typeof err.res.errMsg === "string" &&
              err.res.errMsg.startsWith("request:fail")
              ? "网络不在状态"
              : "发生未知错误"
          ),
          showCancel: false
        });
      }
    );

  },

  async onLoad() {

    wx.showLoading({ title: "正在加载…", mask: true });
    await this.setClassmates();
    this.setData({ loaded: true });
    wx.hideLoading();

  },

  async onPullDownRefresh() {

    await this.setClassmates();
    wx.stopPullDownRefresh();

  }

});
