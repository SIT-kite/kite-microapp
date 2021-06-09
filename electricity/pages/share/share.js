// pages/freshman/share/share.js
import {
  handlerGohomeClick,
  handlerGobackClick
} from '../../../utils/navBarUtils'

const app = getApp();

let hasPermission = true;

Page({

  data: {
    url: '',
    rank: {
      con: 0,
      percen: ' '
    },
    globalwidth: 0,
    globalheight: 0
  },

  handlerGohomeClick,
  handlerGobackClick,

  px() {
    return this.data.globalwidth / 750;
    // return 0.5;
  },

  onLoad(options) {

    const that = this;

    console.log({
      options,
      userAvatar: app.globalData.userAvatar,
      nickName: app.globalData.nickName
    });

    const systemInfo = wx.getSystemInfoSync();
    that.data.globalwidth = systemInfo.windowWidth;
    console.log("globalwidth: ", that.data.globalwidth);

    that.data.rank = JSON.parse(options.rank);

    wx.downloadFile({
      // url: `${app.globalData.userAvatar.replace('thirdwx','wx')}`,
      url: app.globalData.userAvatar,
      success: res => {
          that.data.url = res.tempFilePath;
          console.log("url: ", that.data.url);
          wx.showLoading({ title: "正在绘制" });
          wx.createSelectorQuery().select("#canvas").node(res => {

            const px = this.px();
            const cw =  650 * px;
            const ch = 1000 * px;

            const canvas = res.node;
            canvas.width = cw;
            canvas.height = ch;
            console.log({ cw, ch });

            that.tryDraw(canvas, cw, ch);

          }).exec();
      },
      fail: res => {
        wx.showModal({ content: "头像获取失败，请至反馈群反馈！" });
        console.log("头像获取失败", res);
        that.setData({
          err: JSON.stringify(res),
          url: app.globalData.userAvatar
        });
      }
    });
    // this.data.url = 'url';

  },

  tryDraw(canvas, cw, ch) {

    const that = this;
    const px = this.px();
    const ctx = canvas.getContext("2d");

    console.log({canvas, context: ctx});

    // 图像需要先载入，再在回调函数 onload 中绘制
    const drawImageBySrc = (src, dx, dy, dWidth, dHeight, callback) => Object.assign(
      canvas.createImage(), {
        src,
        onload: e => {
          ctx.drawImage(e.target, dx, dy, dWidth, dHeight);
          typeof callback === "function" && callback();
        },
        onerror: console.error
      }
    );
  
    // 预先载入头像，避免因在回调函数 onload 中绘制而无法按路径裁剪 clip()
    const avatar = canvas.createImage();
    avatar.src = this.data.url;
    avatar.onload = () => {

      console.log("头像已载入");

      const avatar_w = 150 * px;
      const avatar_h = 150 * px;
      const avatar_x = cw / 2 - avatar_w / 2;
      const avatar_y = 20 * px;
  
      const main_x = 50 * px;
      const main_y = avatar_h + avatar_y;
      const main_w = 550 * px;
      const main_h = ch - (avatar_h / 2 + avatar_y) - 40 * px;
  
      // 背景
      ctx.beginPath();
    
        var gra = ctx.createLinearGradient(0, 0, cw, ch);
        gra.addColorStop(0.1, "#ABDCFF");
        gra.addColorStop(1, "#0396FF");
        ctx.fillStyle = gra;

        // ctx.fillStyle = 'rgb(48,191,109)'
        ctx.fillRect(0, 0, cw, ch)
        ctx.fillStyle = '#fafafa'
        ctx.fillRect(main_x, main_y - avatar_h / 2, main_w, main_h)
        ctx.arc(
          avatar_w / 2 + avatar_x,
          avatar_h / 2 + avatar_y,
          avatar_w / 2 + 5 * px, 0, Math.PI * 2
        );
        ctx.fillStyle = 'white'
        ctx.fill()
  
      ctx.closePath();
  
      ctx.save();
  
      // 头像
      ctx.beginPath();
        ctx.arc(
          avatar_w / 2 + avatar_x,
          avatar_h / 2 + avatar_y,
          avatar_w / 2, 0, Math.PI * 2
        );
        ctx.clip();
      ctx.closePath();

      ctx.drawImage(avatar, avatar_x, avatar_y, avatar_w, avatar_h)

      ctx.restore();

      // ctx.drawImage(img('../../asset/pic/bangdan.jpg'), main_x + 30 * px, main_y + 60 * px, 100 * px, 100 * px);

      // 用户名
      ctx.fillStyle = 'black'; // 文字颜色
      ctx.font = `normal bold ${parseInt(42*px)}px Microsoft YaHei`;
      const name = `${app.globalData.nickName}`;
      const name_metrics = ctx.measureText(name);
      ctx.fillText(
        name,
        main_x + main_w / 2 - name_metrics.width / 2,
        main_y + 60 * px
      );
  
      // 第一行字
      // 昨日消耗电费 xx.xx 元
      // text1        bill  text2
      ctx.font = `normal bold ${parseInt(36*px)}px Microsoft YaHei`;
      const text1 = "昨日消耗电费";
      const text1_metrics = ctx.measureText(text1);
  
      ctx.font = `normal bold ${parseInt(50*px)}px Microsoft YaHei`;
      const bill = `${this.data.rank.con}`;
      const bill_metrics = ctx.measureText(bill);
  
      ctx.font = `normal bold ${parseInt(36*px)}px Microsoft YaHei`;
      const text2 = "元";
      const text2_metrics = ctx.measureText(text2);

      const line1_center =
        text1_metrics.width +
        bill_metrics.width +
        text2_metrics.width + 20 * px + 40 * px;
  
      ctx.font = `normal bold ${parseInt(36*px)}px Microsoft YaHei`;
      ctx.fillText(
        text1,
        main_x + (main_w - line1_center) / 2,
        main_y + 160 * px
      );
  
      ctx.fillStyle = "red"
      ctx.font = `normal bold ${parseInt(50*px)}px Microsoft YaHei`;
      ctx.fillText(
        bill,
        main_x + (main_w - line1_center) / 2 + text1_metrics.width + 20 * px,
        main_y + 160 * px
      );
  
      ctx.fillStyle = 'black';
      ctx.font = `normal bold ${parseInt(36*px)}px Microsoft YaHei`;
      ctx.fillText(
        text2,
        main_x + (main_w - line1_center) / 2 + text1_metrics.width + bill_metrics.width + 40 * px,
        main_y + 160 * px
      );
  
      // 第二行字
      // 超越了 yy.yy% 的寝室
      // text3 percent text4

      // const s_center = tw.width+numw.width+yuanw.width+20*px+40*px;
      ctx.font = `normal bold ${parseInt(36*px)}px Microsoft YaHei`;
      const text3 = "超越了";
      const text3_metrics = ctx.measureText(text3);

      ctx.font = `normal bold ${parseInt(50*px)}px Microsoft YaHei`;
      const percent = `${this.data.rank.percen}%`;
      const percent_metrics = ctx.measureText(percent);

      ctx.font = `normal bold ${parseInt(36*px)}px Microsoft YaHei`;
      const text4 = "的寝室";
      const text4_metrics = ctx.measureText(text3);

      const line2_center =
        text3_metrics.width +
        percent_metrics.width +
        text4_metrics.width + 20 * px + 60 * px;
  
      ctx.fillStyle = 'black';
      ctx.font = `normal bold ${parseInt(36*px)}px Microsoft YaHei`;
      ctx.fillText(
        text3,
        main_x + (main_w - line1_center) / 2 + (line1_center - line2_center) / 2,
        main_y + 230 * px
      );
  
      ctx.fillStyle = 'red';
      ctx.font = `normal bold ${parseInt(50*px)}px Microsoft YaHei`;
      ctx.fillText(
        percent,
        main_x + (main_w - line1_center) / 2 + text3_metrics.width +
        20 * px +
        (line1_center - line2_center) / 2,
        main_y + 230 * px
      );
  
      ctx.fillStyle = 'black';
      ctx.font = `normal bold ${parseInt(36*px)}px Microsoft YaHei`;
      ctx.fillText(
        text4,
        main_x + (main_w - line1_center) / 2 + text3_metrics.width +
        percent_metrics.width + 40 * px +
        (line1_center - line2_center) / 2,
        main_y + 230 * px
      );

      // 图片 省电达人 / 空调才是本体
      drawImageBySrc(
        "../../asset/pic/" + (
          this.data.rank.percen / 100 > 0.5
          ? 'nocold.png'
          : 'shengdian.png'
        ),
        main_x + (main_w - 330 * px) / 2,
        main_y + 270 * px,
        330 * px, 330 * px
      );
  
      // 图片 小程序码
      drawImageBySrc(
        '../../asset/pic/share_code.png',
        main_w - 110 * px,
        main_y + main_h - 170 * px - avatar_h / 2,
        150 * px, 150 * px
      );

      ctx.font = `normal ${parseInt(24*px)}px Microsoft YaHei`;

      // 长按识别小程序码
      const sharetext1 = "长按识别小程序码";
      ctx.fillStyle = '#a0a0a0';
      ctx.fillText(
        sharetext1,
        main_x + main_w - 180 * px - ctx.measureText(sharetext1).width,
        main_y + main_h - 100 * px - avatar_h / 2
      );

      // 打开上应小风筝，享受便利校园
      const sharetext2 = "打开上应小风筝，享受便利校园";
      ctx.fillStyle = '#a0a0a0';
      ctx.fillText(
        sharetext2,
        main_x + main_w - 180 * px - ctx.measureText(sharetext2).width,
        main_y + main_h -  60 * px - avatar_h / 2
      );

      // 保存为临时文件
      wx.canvasToTempFilePath({
        canvas,
        success(res) {
          console.log("success", res);
          that.setData({ tempfile: res.tempFilePath });
        },
        fail(res) {
          console.log("fail", res);
          wx.showToast({ title: '绘制失败' });
        },
        complete() {
          // wx.hideToast();
          wx.hideLoading();
        }
      })

    };

  },

  share: function () {
    const that = this;
    wx.previewImage({
      current: `${that.data.tempfile}`, // 当前显示图片的http链接
      urls: [ `${that.data.tempfile}` ] // 需要预览的图片http链接列表
    });
    wx.showToast({
      title: '长按图片以分享',
      icon: 'none'
    });
  },

  saveShareImg: function () {

    const saveImage = () => wx.saveImageToPhotosAlbum({
      filePath: this.data.tempfile,
      success() {
        wx.showToast({
          title: '图片保存成功，快去分享到朋友圈吧~',
          duration: 3000
        })
      },
      fail() {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    });

    const scope = "scope.writePhotosAlbum";

    // 获取用户是否开启用户授权相册
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
          // 如果没有则获取授权
          if (!res.authSetting[scope]) {
            wx.authorize({
              scope,
              success() {
                hasPermission = true;
                saveImage();
              },
              fail() {
                // 如果用户拒绝过或没有授权，则再次打开授权窗口
                hasPermission = false;
                wx.showToast({
                  title: '请设置允许访问相册',
                  icon: 'none'
                });
              }
            })
          } else {
            // 有则直接保存
            hasPermission = true;
            saveImage();
          }
        },
        fail(err) {
          console.log(err)
        }
      })
    }
  },

  onReady: function () {},
  onShow: function () {}

})