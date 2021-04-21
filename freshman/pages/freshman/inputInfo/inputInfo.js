//index.js
//获取应用实例
import { handlerGohomeClick, handlerGobackClick } from '../../../../utils/navBarUtils'
const app = getApp();
const requestUtils = require("../../../../utils/requestUtils");

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
    console.log(e.detail.value);

    const text = ["向您推送可能认识的人", "将您推送给他人（同城，同乡…）"];
    wx.showModal(
      e.detail.value[0] == undefined ? {
        title: "取消勾选",
        content: `我们将不会${ text[0] }，也不会${ text[1] }`,
        showCancel: false,
        success() {
          that.data.visible = false;
          console.log(that.data.visible);
        }
      } : {
        title: "勾选",
        content: `我们将${ text[0] }，并${ text[1] }`,
        showCancel: false,
        success() {
          that.data.visible = true;
          console.log(that.data.visible);
        }
      }
    );

    if (e.detail.value[0] == undefined) {
      // 取消勾选
      wx.showModal()
    } else {
      // 勾选
      wx.showModal()

    }
  },
  onShow: function () {
    const {
      navBarHeight,
      navBarExtendHeight,
    } = getApp().globalSystemInfo;
    this.setData({
      navBarCurrentHeight: navBarExtendHeight + navBarHeight
    })
  },
  gotoStuInfoDetail() {
    const data = this.data;
    // 没有隐藏输入框（第一次输入个人信息）
    if (data.isHidden == "flex") {
      if (data.userInfo.account == "") {
        // 账号未填写
        wx.showModal({
          title: "哎呀，出错误了 >.<",
          content: "请输入姓名/考生号/准考证号其中的一个",
          showCancel: false
        });
      // } else if(this.data.userInfo.secret.length != 6 || this.data.userInfo.secret == ""){
      } else if (!/[0-9]{5}[0-9X]/.test(data.userInfo.secret)) {
        // secret不符合格式
        wx.showModal({
          title: "哎呀，出错误了 >.<",
          content: "需要输入身份证后六位哦",
          showCancel: false
        });
      } else {
        // 满足输入框要求 发送PUT请求
        const PUT = {
          url: `${app.globalData.commonUrl}/freshman/${data.userInfo.account}`,
          data: {
            "secret": `${data.userInfo.secret}`,
            "contact": JSON.stringify(data.contact),
            "visible": data.visible
          },
          header: {
            "content-type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${app.globalData.token}`,
          }
        };

        const putFreshman = requestUtils.doPUT(PUT.url, PUT.data, PUT.header).then(res => {
          // 本地Storage存储userInfo
          wx.setStorageSync("userInfo", data.userInfo);
          // 全局同时更新
          app.globalData.visible  = data.visible;
          app.globalData.userInfo = data.userInfo;
          app.globalData.contact  = data.contact;
          wx.redirectTo({
            url: '/freshman/pages/freshman/stuInfoDetail/stuInfoDetail',
            success: () => console.log("跳转 stuInfoDetail 页面成功")
          });
          return res;
        });
        putFreshman.then(() => {
          console.log("putFreshman 数据加载完成");
        }).catch(
          res => wx.showModal({
            title: "哎呀，出错误了 >.<",
            content: (
              res.error == requestUtils.REQUEST_ERROR ? "业务逻辑出错"
              : res.error == requestUtils.NO_ACCOUNT_ERROR ? "查询不到该用户的信息"
              : res.error == requestUtils.NETWORK_ERROR ? "网络不在状态"
              : "未知错误"
            ),
            showCancel: false
          })
        );
      }
    } else {

      //  非第一次进入 修改信息
      const PUT = {
        url: `${app.globalData.commonUrl}/freshman/${data.userInfo.account}`,
        data: {
          "secret": `${app.globalData.userInfo.secret}`,
          "contact": JSON.stringify(data.contact),
          "visible": data.visible
        },
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${app.globalData.token}`
        }
      };

      const patchFreshman = requestUtils.doPUT(PUT.url, PUT.data, PUT.header).then(res => {
        // Storage 和 globalData 同时更新
        wx.setStorageSync("userInfo", this.data.userInfo);
        app.globalData.visible = this.data.visible;
        app.globalData.contact = this.data.contact;
        wx.redirectTo({
          url: '/freshman/pages/freshman/stuInfoDetail/stuInfoDetail',
          success: () => {
            console.log("跳转至页面 stuInfoDetail");
          },
          fail: (err) => console.log(err),
        });
        return res;
      });

      patchFreshman.then(() => {
        console.log("patchFreshman 数据处理完成");
      }).catch(
        res => wx.showModal({
          title: "哎呀，出错误了 >.<",
          content: (
            res.error == requestUtils.REQUEST_ERROR ? "业务逻辑出错"
            : res.error == requestUtils.NETWORK_ERROR ? "网络不在状态"
            : "未知错误"
          ),
          showCancel: false
        })
      );

    }
  },

  // 获得用户输入的姓名
  getName(e) {
    this.setData({
      'userInfo.account': e.detail.value
    });
  },
  getSecret(e) {
    this.setData({
      'userInfo.secret': e.detail.value.toString().toUpperCase()
    })
  },
  getPhoneNumber(e) {
    this.setData({
      'contact.tel': e.detail.value
    });
  },
  getqq(e) {
    this.setData({
      'contact.qq': e.detail.value
    });
  },
  getwechat(e) {
    this.setData({
      'contact.wechat': e.detail.value
    });
  },

  onLoad: function (option) {
    console.log(option.isHidden);
    console.log('onLoad');
    console.log(this.data.userInfo);
    // 如果为none，说明现在执行修改功能，需要把全局变量中的contact拷贝一份,展示在input框中
    if (option.isHidden == "none") {
      this.setData({
        contact: app.globalData.contact,
        userInfo: app.globalData.userInfo,
        visible: app.globalData.visible,
        buttonText: option.isHidden == "flex" ? "提交" : "确定",
        isHidden: option.isHidden,
        avatarUrl: app.globalData.userAvatar,
        nickName: app.globalData.nickName
      })
      console.log(this.data.visible);
    } else {
      this.setData({
        buttonText: option.isHidden == "flex" ? "提交" : "确定",
        isHidden: option.isHidden,
        avatarUrl: app.globalData.userAvatar,
        nickName: app.globalData.nickName
      })
    }
    console.log("inputInfo onload over")
  },
  onReady: function () {
    console.log(this.data.isHidden);

    if (
      "flex" == this.data.isHidden &&
      app.globalData.freshmanPrivacyConfirm != true
    ) {
      wx.showModal({
        title: "隐私信息提示",
        content: "您的身份证号后6位和准考证号将用于身份验证、查询寝室位置、查找舍友信息等用途。您的手机号、QQ、微信为可选项，填写后，同寝室的同学可以看到你的手机号、QQ、微信，同班同学可以看到你的QQ和微信。如果您授权，您可能认识的人也可以查看您的QQ和微信。我们仅保留您的联系方式约一周时间。",
        showCancel: true,
        cancelText: "拒绝",
        cancelColor: "#000000",
        confirmText: "我已知晓",
        confirmColor: "#4B6DE9",
        success: result => {
          if (result.confirm) {
            app.globalData.freshmanPrivacyConfirm = true;
            wx.setStorageSync("freshmanPrivacyConfirm", true);
          } else {
            this.handlerGohomeClick();
          }
        }
      });
    }
  },
  onShareAppMessage: function (e) {
    return {
      title: "上应小风筝",
      path: "pages/index/index"
    }
  }
})
