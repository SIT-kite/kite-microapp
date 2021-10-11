// 电费分享
// electricity/pages/share/share.js

// TODO: 支持选择是否显示用户名、头像和寝室号

import promisify from "../../../utils/promisify";
import loading   from "../../../utils/loading";
import drawCanvas from "./drawCanvas";

const app = getApp();

const noIconToast = title => wx.showToast({ title, icon: "none" });

Page({

  data: {
    nickName: app.globalData.nickName,
    avatarPath: "",
    imagePath: "",
    rank: null,
    error: ""
  },

  onLoad(options) {

    const { consumption, percent } = options;
    this.data.rank = { consumption, percent };

  },

  onShow() {

    // 预先缓存头像
    promisify(wx.downloadFile)({ url: app.globalData.avatarUrl }).then(
      res => {
        this.data.avatarPath = res.tempFilePath;
      }
    ).catch(
      err => {
        this.catchError("头像获取失败，改用默认头像", err);
        this.data.avatarPath = "/assets/pic/default-avatar.png";
      }
    ).finally(
      () => this.draw()
    );

  },

  catchError(msg, err) {
    console.error(msg, err);
    wx.showModal({
      content: `${ msg }，请至反馈群反馈！`,
      showCancel: false
    });
    this.setData({ error: JSON.stringify(err) });
  },

  draw() {

    // 选中 canvas 元素
    wx.createSelectorQuery().select("#canvas").node(res => {

      const canvas = res.node;

      // 绘制 canvas 并将 canvas 保存为临时文件
      loading({
        title: "正在绘制…",
        mask: true,
        callback: async () => {

          await drawCanvas(canvas, this.data);

          await wx.canvasToTempFilePath({ canvas }).then(
            res => this.setData({ imagePath: res.tempFilePath })
          ).catch(
            err => this.catchError("分享图绘制失败", err)
          );

        }
      });

    }).exec();

  },

  share() {
    wx.previewImage({ urls: [ this.data.imagePath ] });
    noIconToast("长按图片即可分享");
  },

  saveShareImg() {

    const saveImage = () => wx.saveImageToPhotosAlbum({
      filePath: this.data.imagePath
    }).then(
      () => wx.showToast({
        title: "图片保存成功",
        duration: 3000
      })
    ).catch(
      err => this.catchError("图片保存失败", err)
    );

    // 获取用户是否已授权相册权限
    const scope = "scope.writePhotosAlbum";
    let hasPermission = true;

    if (!hasPermission) {
      wx.openSetting({
        success: result => {
          if (result && result.authSetting[scope] === true) {
            hasPermission = true;
            saveImage();
          }
        }
      });
    } else {
      wx.getSetting({
        success(res) {
          if (res.authSetting[scope]) {
            // 有则直接保存
            hasPermission = true;
            saveImage();
          } else {
            // 如果没有则获取授权
            wx.authorize({
              scope,
              success() {
                hasPermission = true;
                saveImage();
              },
              fail() {
                // 如果用户没有授权，则提示手动授权
                hasPermission = false;
                noIconToast("请在设置中允许上应小风筝访问相册");
              }
            });
          }
        },
        fail: console.error
      })
    }
  },

  // onReady() {},
  // onShow() {}

})
