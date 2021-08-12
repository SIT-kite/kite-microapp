// electricity/pages/share/share.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import promisify from "../../../utils/promisify";
import loading from "../../../utils/loading";
import drawCanvas from "./drawCanvas";

const app = getApp();

const noIconToast = title => wx.showToast({ title, icon: "none" });

let hasPermission = true;

Page({

  data: {
    imagePath: "",
    avatarPath: "",
    rank: {
      con: 0,
      percen: ' '
    },
    error: "",
    globalwidth: 0,
    globalheight: 0
  },

  handlerGohomeClick,
  handlerGobackClick,

  catchError(msg, err) {
    console.error(msg, err);
    wx.showModal({
      content: `${ msg }，请至反馈群反馈！`,
      showCancel: false
    });
    this.setData({ error: JSON.stringify(err) });
  },

  draw() {

    wx.createSelectorQuery().select("#canvas").node(res => {

      const canvas = res.node;

      loading({

        title: "正在绘制分享图…",
        callback: async () => {

          await drawCanvas(canvas, this.data, app.globalData.nickName);

          // 保存为临时文件
          await wx.canvasToTempFilePath({ canvas }).then(
            res => {
              console.log("canvas success", res);
              this.setData({ imagePath: res.tempFilePath });
            }
          ).catch(
            err => this.catchError("分享图绘制失败", err)
          );

        }

      });

    }).exec();

  },

  onLoad(options) {

    console.log({
      options,
      avatarUrl: app.globalData.avatarUrl,
      nickName: app.globalData.nickName
    });

    this.data.rank = JSON.parse(options.rank);

    promisify(wx.downloadFile)({ url: app.globalData.avatarUrl }).then(
      res => {
        console.log("url: ", res.tempFilePath);
        this.data.avatarPath = res.tempFilePath;
        this.draw();
      }
    ).catch(
      err => {
        this.catchError("头像获取失败", err);
        this.data.avatarPath = "/assets/pic/default-avatar.png";
        this.draw();
      }
    );

  },

  share() {
    wx.previewImage({ urls: [ this.data.imagePath ] });
    noIconToast("长按图片以分享");
  },

  saveShareImg() {

    const saveImage = () => wx.saveImageToPhotosAlbum({
      filePath: this.data.imagePath
    }).then(
      () => wx.showToast({
        title: "图片保存成功，快去分享吧~",
        duration: 3000
      })
    ).catch(
      () => wx.showToast({
        title: "图片保存失败",
        icon: "error"
      })
    );

    const scope = "scope.writePhotosAlbum";

    // 获取用户是否已授权相册权限
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