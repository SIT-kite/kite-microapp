// 主页
// pages/index/index.js

import { isNonEmptyString } from "../../utils/type";
import onShareAppMessage from "../../utils/onShareAppMessage";
import getHeader from "../../utils/getHeader";

const app = getApp();
const gData = app.globalData;

// checkUrl(url: String): url: String || false
// 按需更改并返回模块路径；模块不可用时，原地弹出对话框提示，并返回 false
const checkUrl = url => {

  switch (url) {

    // TEMP 电费升级通知
    case "/electricity/pages/show/show":
      wx.showModal({
        title: "提示",
        content: "电费模块正在升级中，详情请见公告~",
        cancelText: "关闭",
        confirmText: "查看公告",
        success: res => res.confirm && wx.navigateTo({
          url: "/pages/article/article?url=https://mp.weixin.qq.com/s/W2wqTQqg00jy1jQm73s63Q"
        })
      });
      return false;

    // 如果点击“迎新”，但是 userDetail 不为空，则直接跳转到 stuInfoDetail
    case "/freshman/pages/welcome/welcome":
      if (gData.userDetail !== null) {
        return "/freshman/pages/stuInfoDetail/stuInfoDetail";
      } else {
        return url;
      }

    default: return url;

  }

};

Page({

  data: {

    isLogin: gData.isLogin,
    clicked: -1, // 被点击功能的索引
    notices: [], // 通知

    items: [
      {
        text: "新生",
        url: "/freshman/pages/welcome/welcome",
        iconPath: "/assets/icons/index/freshman.png"
      },
      {
        text: "电费",
        url: "/electricity/pages/show/show",
        iconPath: "/assets/icons/index/electricity.png"
      },
      {
        text: "空教室",
        url: "/class-room/pages/available-room",
        iconPath: "/assets/icons/index/availroom.png"
      },
      {
        text: "课表",
        url: "/timetable/pages/index/index",
        iconPath: "/assets/icons/index/timetable.png"
      },
      {
        text: "常用电话",
        url: "/contact/pages/show/show",
        iconPath: "/assets/icons/index/telephone.png"
      },
      {
        text: "成绩",
        url: "/score/pages/index/index",
        iconPath: "/assets/icons/index/score.png"
      },
      {
        text: "活动",
        url: "/activity/pages/index/index",
        iconPath: "/assets/icons/index/activity.png"
      },
      /* {
        text: "消费",
        url: "/consume/pages/index/index",
        iconPath: "/assets/icons/index/consume.png"
      },
      {
        text: "商城",
        url: "/shop/pages/index/index",
        iconPath: "/assets/icons/index/shop.png"
      }, */
    ]

  },

  onShareAppMessage,

  onLoad() {

    // 获取并设置通知 notice；目前不对其检查错误代码，所以直接用 wx.request()
    wx.request({
      url: `${gData.apiUrl}/notice`,
      header: getHeader("urlencoded", gData.token),
      success: res => this.setNotice(res.data.data),
      fail: console.error
    });

  },

  onShow() {

    // 如果页面 isLogin 与全局 isLogin 不一致，则从全局同步到页面
    this.data.isLogin !== gData.isLogin &&
      this.setData({ isLogin: gData.isLogin });

  },

  // banner 的点击事件；改成动态 banner 以后删掉
  doNothing() {},
  goTemp() {
    wx.navigateTo({
      url: "/freshman/pages" + (
        gData.userDetail !== null
          ? "/stuInfoDetail/stuInfoDetail"
          : "/welcome/welcome"
      )
    });
  },

  // setNotice(notices: Array)
  setNotice(notices) {

    const noNotice = () => {
      const title = "暂无通知";
      this.setData({ notice: [{ title, id: -1 }] });
      console.log(title);
    };

    if (Array.isArray(notices)) {

      if (notices.length > 0) {
        this.setData({ notices });
        console.groupCollapsed("%c通知数据", "font-weight: normal");
        notices.forEach(notice => console.log(notice));
        console.groupEnd();
      } else {
        noNotice();
      }

    } else {
      console.error("notice is not an Array", notices);
      noNotice();
    }

  },

  // showNotice(e.target.dataset: { id: Number })
  // 点击通知后，按需弹出对话框，显示通知内容或通知全文
  // 目前，点击无内容的短通知不反应，要不要加个 wx.showToast()，提示一下用户？
  showNotice(e) {
    const notice = this.data.notices.find(
      item => item.id === e.target.dataset.id
    );
    if (notice !== undefined) {
      if (isNonEmptyString(notice.content)) {
        wx.showModal({ // 含内容通知
          title: notice.title,
          content: notice.content,
          confirmText: "关闭",
          showCancel: false
        });
      } else if (notice.title.length > 20) {
        wx.showModal({ // 长通知
          title: "通知详情",
          content: notice.title,
          confirmText: "关闭",
          showCancel: false
        });
      }
    }
  },

  // router(e.currentTarget.dataset: { index: Number, url: String })
  router(e) {

    // dataset: { index: Number, url: String }
    const dataset = e.currentTarget.dataset;

    // 设置被点击功能索引 clicked，为图标显示点击动画；一秒后重置
    this.setData({ clicked: dataset.index });
    setTimeout(() => this.setData({ clicked: -1 }), 1000);

    /* if (url) {
      isLogin ? 跳转到目标页面 : 提示用户登录
    } */
    const url = checkUrl(dataset.url);
    url && (
      gData.isLogin
      ? wx.navigateTo({ // 已登录，跳转到目标页面
        url, fail: () => wx.showModal({ // 页面跳转失败时，显示未完成
          title: "正在开发",
          content: "功能尚未完成，正在努力开发~",
          confirmText: "知道了",
          showCancel: false
        })
      })
      : wx.showModal({ // 未登录，提示用户登录，点击“确定”后切换到“我”
        title: "请登录",
        content: "尚未登录，请前往登录",
        success: res => res.confirm && wx.switchTab({ url: "/pages/user/user" })
      })
    );

  }

});
