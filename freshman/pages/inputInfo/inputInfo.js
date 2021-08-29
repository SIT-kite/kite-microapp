// freshman/pages/inputInfo/inputInfo.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import getHeader  from "../../../utils/getHeader";
import catchError from "../../../utils/requestUtils.catchError";
import onShareAppMessage from "../../js/onShareAppMessage";
import request from "../../../utils/request";

const app = getApp();
const gData = app.globalData;

Page({
  data: {
    buttonText: "",
    isHidden: "flex",
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
    const { isHidden, userInfo: freshman, contact, visible } = this.data;
    const { account, secret } = freshman;
    // 没有隐藏输入框（第一次输入个人信息）
    if (isHidden === "flex") {

      const errorModal = content => wx.showModal({
        title: "哎呀，出错误了 >.<",
        content,
        showCancel: false
      });

      if (account === "") {
        // 账号未填写
        errorModal("请输入姓名/考生号/准考证号其中的一个");
      } else if (!/^[0-9]{5}[0-9X]$/.test(secret)) {
        // secret 不符合格式
        errorModal("需要输入身份证后六位哦");
      } else {
        // 满足输入框要求 发送PUT请求

        request({
          method: "PUT",
          url: `${gData.apiUrl}/freshman/${account}`,
          header: getHeader("urlencoded", gData.token),
          data: { secret, visible, contact: JSON.stringify(contact) }
        }).then(() => {

          // 向本地存储 Storage 设置 userInfo
          wx.setStorageSync("userInfo", freshman);
          // 向全局对象 globalData 设置 userInfo 和其他信息
          Object.assign(gData, { userInfo: freshman, contact, visible });

          wx.redirectTo({ url: "/freshman/pages/stuInfoDetail/stuInfoDetail" });

        }).catch(catchError);

      }

    } else {
      // 非第一次进入 修改信息
      // PUT freshman
      request({
        method: "PUT",
        url: `${gData.apiUrl}/freshman/${account}`,
        header: getHeader("urlencoded", gData.token),
        data: { secret, visible, contact: JSON.stringify(contact) }
      }).then(() => {

        Object.assign(gData, { contact, visible });

        wx.redirectTo({ url: "/freshman/pages/stuInfoDetail/stuInfoDetail" });

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
    this.setData({
      buttonText: option.isHidden === "flex" ? "提交" : "确定",
      isHidden: option.isHidden
    })
    // 如果为none，说明现在执行修改功能，需要把全局变量中的contact拷贝一份,展示在input框中
    if (option.isHidden === "none") {
      this.setData({
        contact: gData.contact,
        userInfo: gData.userInfo
      })
    }
    console.log("onLoad(): option = ", option);
    console.log("onLoad(): this.data = ", this.data);
  },

  onReady() {
    if (
      "flex" === this.data.isHidden &&
      gData.freshmanPrivacyConfirm !== true
    ) {
      wx.showModal({
        title: "隐私信息提示",
        content:
        "您的身份证号后6位和准考证号将用于身份验证、查询寝室位置、查找舍友信息" +
        "等用途。您的手机号、QQ、微信为可选项，填写后，同寝室的同学可以看到" +
        "你的手机号、QQ、微信，同班同学可以看到你的QQ和微信。如果您授权，" +
        "您可能认识的人也可以查看您的QQ和微信。",
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
    const { navBarHeight, navBarExtendHeight } = getApp().globalSystemInfo;
    this.setData({
      navBarCurrentHeight: navBarExtendHeight + navBarHeight
    });
  }

})
