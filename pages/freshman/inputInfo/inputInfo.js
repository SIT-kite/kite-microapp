//index.js
//获取应用实例
import { handlerGohomeClick, handlerGobackClick } from '../../../utils/navBarUtils'
const app = getApp();
const requestUtils = require("../../../utils/requestUtils");
const secretRex = /[0-9]{5}[0-9X]/;
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
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick,

  checkBoxChange(e) {
    var that = this;
    console.log(e.detail.value);
    // 取消勾选
    if (e.detail.value[0] == undefined) {
      wx.showModal({
        title: "取消勾选",
        content: "我们将不会给您推送可能认识的人,并且不会将您推送给他人（同城，同乡..）",
        showCancel: false,
        success(res) {
          that.data.visible = false;
          console.log(that.data.visible);
        }
      })
    }
    // 勾选
    else {
      wx.showModal({
        title: "勾选",
        content: "我们将给您推送可能认识的人，包括将您推送给他人（同城，同乡..）",
        showCancel: false,
        success(res) {
          that.data.visible = true;
        }
      })

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
  gotoStuInfoDetail(e) {
    var that = this;
    let url = "";
    let data = {};
    let header = {};
    // 没有隐藏输入框（第一次输入个人信息）
    if (this.data.isHidden == "flex") {
      if (this.data.userInfo.account == "") {
        // 账号未填写
        wx.showModal({
          title: "哎呀，出错误了>.<",
          content: "请输入姓名/考生号/准考证号其中的一个",
          showCancel: false,
          success(res) { }
        })
      }
      // else if(this.data.userInfo.secret.length != 6 || this.data.userInfo.secret == ""){
      else if (!secretRex.test(this.data.userInfo.secret)) {
        // secret不符合格式
        wx.showModal({
          title: "哎呀，出错误了>.<",
          content: "需要输入身份证后六位哦",
          showCancel: false,
          success(res) { }
        })
      } else {
        // 满足输入框要求 发送PUT请求
        url = `${app.globalData.commonUrl}/freshman/${this.data.userInfo.account}`;
        data = {
          "secret": `${this.data.userInfo.secret}`,
          "contact": JSON.stringify(this.data.contact),
          "visible": this.data.visible
        };
        header = {
          "content-type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${app.globalData.token}`,
        };

        var putFreshman = requestUtils.doPUT(url, data, header).then(res => {
          // 本地Storage存储userInfo
          wx.setStorageSync("userInfo", this.data.userInfo);
          // 全局同时更新
          app.globalData.visible = this.data.visible;
          app.globalData.userInfo = this.data.userInfo;
          app.globalData.contact = this.data.contact;
          wx.redirectTo({
            url: '/pages/freshman/stuInfoDetail/stuInfoDetail',
            success: (result) => {
              console.log("跳转 stuInfoDetail 页面成功");
            }
          });
          return res;
        });
        putFreshman.then(res => {
          console.log("数据加载完成");
        }).catch(res => {
          if (res.error == requestUtils.REQUEST_ERROR) {
            wx.showModal({
              title: "哎呀，出错误了>.<",
              content: res.data,
              showCancel: false,
            });
          }
          if (res.error == requestUtils.NO_ACCOUNT_ERROR) {
            wx.showModal({
              title: "哎呀，出错误了>.<",
              content: "查询不到该用户的信息",
              showCancel: false,
            });
          }
          if (res.error == requestUtils.NETWORK_ERROR) {
            wx.showModal({
              title: "哎呀，出错误了>.<",
              content: "网络不在状态",
              showCancel: false,
            });
          }
        });
      }
    } else {
      //  非第一次进入 修改信息
      url = `${app.globalData.commonUrl}/freshman/${app.globalData.userInfo.account}`;
      data = {
        "secret": `${app.globalData.userInfo.secret}`,
        "contact": JSON.stringify(this.data.contact),
        "visible": this.data.visible
      };
      header = {
        "content-type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${app.globalData.token}`,
      };
      var patchFreshman = requestUtils.doPUT(url, data, header).then(res => {
        // Storage 和 globalData 同时更新
        wx.setStorageSync("userInfo", this.data.userInfo);
        app.globalData.visible = this.data.visible;
        app.globalData.contact = this.data.contact;
        wx.redirectTo({
          url: '/pages/freshman/stuInfoDetail/stuInfoDetail',
          success: (result) => {
            console.log("跳转至页面 stuInfoDetail");
          },
          fail: (err) => console.log(err),
        });
        return res;
      });
      patchFreshman.then(res => {
        console.log("patchFreshman 数据处理完成");
      }).catch(res => {
        if (res.error == requestUtils.REQUEST_ERROR) {
          wx.showModal({
            title: "哎呀，出错误了>.<",
            content: res.data,
            showCancel: false,
          });
        }
        if (res.error == requestUtils.NETWORK_ERROR) {
          wx.showModal({
            title: "哎呀，出错误了>.<",
            content: "网络不在状态",
            showCancel: false,
          });
        }
      });
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
  onReady: function (option) {
    console.log(this.data.isHidden);
    
    if ("flex" == this.data.isHidden) {
      wx.showModal({
        title: '隐私信息提示',
        content: '您的身份证号后6位和准考证号将用于验证您的身份，并查询您的寝室位置、查找您的舍友信息等用途。您的手机号、QQ、微信为可选项，填写后同寝室的人可以看到你的手机号、QQ、微信，班级的人可以看到你的QQ和微信，如果您授权，您可能认识的人也可以查看您的QQ和微信。我们仅保留您的联系方式约1周时间。',
        showCancel: true,
        cancelText: '我拒绝',
        cancelColor: '#000000',
        confirmText: '我已知晓',
        confirmColor: '#4B6DE9',
        success: (result) => {
          if (!result.confirm) {
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