// freshman/pages/inputInfo/inputInfo.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
const requestUtils = require("../../../utils/requestUtils");
import getHeader  from "../../../utils/getHeader";
import catchError from "../../../utils/requestUtils.catchError";
import onShareAppMessage from "../../js/onShareAppMessage";

const app = getApp();
const gData = app.globalData;

Page({
  data: {
    promptText: "",
    buttonText: "",
    isHidden: "flex",
    motto: 'Hey!',
    avatarUrl: "",
    nickName: "",
    userInfo: {
      account: "",
      secret: ""
    },
    contact: {
      tel: "",
      qq: "",
      wechat: ""
    },
    visible: true,
  },

  handlerGohomeClick,
  handlerGobackClick,

  checkBoxChange(e) {
    const that = this;
    console.log("checkBoxChange(): e.detail.value = ", e.detail.value);

    const text = ["向您推送可能认识的人", "将您推送给他人（同城，同乡…）"];
    wx.showModal(
      e.detail.value[0] === undefined ? {
        title: "取消勾选",
        content: `我们将不会${ text[0] }，也不会${ text[1] }`,
        showCancel: false,
        success() {
          that.data.visible = false;
          console.log("checkBoxChange(): that.data.visible = ", that.data.visible);
        }
      } : {
        title: "勾选",
        content: `我们将${ text[0] }，并${ text[1] }`,
        showCancel: false,
        success() {
          that.data.visible = true;
        }
      }
    );
  },

  onShareAppMessage,

  gotoStuInfoDetail() {
    const data = this.data;
    // 没有隐藏输入框（第一次输入个人信息）
    if (data.isHidden === "flex") {
      const errorModal = content => wx.showModal({
        title: "哎呀，出错误了 >.<",
        content,
        showCancel: false
      });
      if (data.userInfo.account === "") {
        // 账号未填写
        errorModal("请输入姓名/考生号/准考证号其中的一个");
      } else if (!/^[0-9]{5}[0-9X]$/.test(data.userInfo.secret)) {
        // secret 不符合格式
        errorModal("需要输入身份证后六位哦");
      } else {
        // 满足输入框要求 发送PUT请求
        const PUT = {
          url: `${gData.apiUrl}/freshman/${data.userInfo.account}`,
          data: {
            "secret": `${data.userInfo.secret}`,
            "contact": JSON.stringify(data.contact),
            "visible": data.visible
          },
          header: getHeader("urlencoded", gData.token)
        };
        // putFreshman
        requestUtils.doPUT(PUT.url, PUT.data, PUT.header).then(() => {
          // 本地Storage存储userInfo
          wx.setStorageSync("userInfo", data.userInfo);
          // 同时更新全局
          gData.visible  = data.visible;
          gData.userInfo = data.userInfo;
          gData.contact  = data.contact;
          wx.redirectTo({
            url: "/freshman/pages/stuInfoDetail/stuInfoDetail"
          });
          console.log("putFreshman 数据加载完成")
        }).catch(catchError);
      }
    } else {

      //  非第一次进入 修改信息
      const PUT = {
        url: `${gData.apiUrl}/freshman/${data.userInfo.account}`,
        data: {
          "secret": `${gData.userInfo.secret}`,
          "contact": JSON.stringify(data.contact),
          "visible": data.visible
        },
        header: getHeader("urlencoded", gData.token)
      };

      // patchFreshman
      requestUtils.doPUT(PUT.url, PUT.data, PUT.header).then(() => {
        // Storage 和 globalData 同时更新
        wx.setStorageSync("userInfo", this.data.userInfo);
        gData.visible = this.data.visible;
        gData.contact = this.data.contact;
        wx.redirectTo({
          url: "/freshman/pages/stuInfoDetail/stuInfoDetail"
        });
        console.log("patchFreshman 数据加载完成")
      }).catch(catchError);

    }
  },

  getName(e) {
    this.setData({
      "userInfo.account": e.detail.value
    });
  },

  getSecret(e) {
    this.setData({
      "userInfo.secret": e.detail.value.toString().toUpperCase()
    })
  },

  getPhoneNumber(e) {
    this.setData({
      'contact.tel': e.detail.value
    });
  },

  getQQ(e) {
    this.setData({
      'contact.qq': e.detail.value
    });
  },

  getWechatId(e) {
    this.setData({
      'contact.wechat': e.detail.value
    });
  },

  onLoad(option) {
    console.log("onLoad(): option.isHidden = ", option.isHidden);
    console.log("onLoad(): this.data.userInfo = ", this.data.userInfo);
    console.log("onLoad(): this.data.visible = ", this.data.visible);
    // 如果为none，说明现在执行修改功能，需要把全局变量中的contact拷贝一份,展示在input框中
    if (option.isHidden === "none") {
      this.setData({
        contact: gData.contact,
        userInfo: gData.userInfo,
        buttonText: option.isHidden === "flex" ? "提交" : "确定",
        isHidden: option.isHidden,
        avatarUrl: gData.avatarUrl,
        nickName: gData.nickName
      })
    } else {
      this.setData({
        buttonText: option.isHidden === "flex" ? "提交" : "确定",
        isHidden: option.isHidden,
        avatarUrl: gData.avatarUrl,
        nickName: gData.nickName
      })
    }
    console.log("onload(): over")
  },

  onReady() {
    console.log("onReady(): this.data.isHidden = ", this.data.isHidden);

    if (
      "flex" === this.data.isHidden &&
      gData.freshmanPrivacyConfirm !== true
    ) {
      wx.showModal({
        title: "隐私信息提示",
        content: "您的身份证号后6位和准考证号将用于身份验证、查询寝室位置、查找舍友信息等用途。您的手机号、QQ、微信为可选项，填写后，同寝室的同学可以看到你的手机号、QQ、微信，同班同学可以看到你的QQ和微信。如果您授权，您可能认识的人也可以查看您的QQ和微信。",
        showCancel: true,
        cancelText: "拒绝",
        cancelColor: "#000000",
        confirmText: "我已知晓",
        confirmColor: "#4B6DE9",
        success: result => {
          if (result.confirm) {
            gData.freshmanPrivacyConfirm = true;
            wx.setStorageSync("freshmanPrivacyConfirm", true);
          } else {
            this.handlerGohomeClick();
          }
        }
      });
    }
  },

  onShow() {
    const {
      navBarHeight,
      navBarExtendHeight,
    } = getApp().globalSystemInfo;
    this.setData({
      navBarCurrentHeight: navBarExtendHeight + navBarHeight
    })
  }

})
