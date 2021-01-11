// pages/freshman/share/share.js
import {
  handlerGohomeClick,
  handlerGobackClick
} from '../../utils/navBarUtils'
const app = getApp();
let openStatus = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    rank: {
      con: 0,
      percen: ' '
    },
    globalwidth: 0,
    globalheight: 0
  },
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    console.log(options)
    console.log(app.globalData.userAvatar)
    console.log(app.globalData.nickName)
    const res = wx.getSystemInfoSync()
    that.data.globalwidth = res.windowWidth;
    that.data.rank = JSON.parse(options.rank);
    
    console.log(that.data.globalwidth)
    const cw = 650 * this.px();
    const ch = 1000 * this.px();
    console.log('cw'+cw);
    console.log('ch'+ch);
    wx.downloadFile({
      // url: `${app.globalData.userAvatar.replace('thirdwx','wx')}`,
      url: `${app.globalData.userAvatar}`,
      success: res => {
          that.data.url = res.tempFilePath
          console.log(that.data.url)
          wx.showLoading({
            title: '绘制中',
          })
          that.trydraw(cw, ch);
      },
      fail: res => {
        wx.showModal({
          content: '获取头像失败，请至反馈群反馈！',
        })
        that.setData({
          err: JSON.stringify(res),
          url:app.globalData.userAvatar
        });
      }
    });
    // this.data.url = 'url';

  },
  trydraw: function (cw, ch) {
    const that = this;
    const px = this.px();
    const ctx = wx.createCanvasContext('myCanvas')
    const avatar_w = 150 * px;
    const avatar_h = 150 * px;
    const avatar_x = cw / 2 - avatar_w / 2;
    const avatar_y = 20 * px;
    const main_x = 50 * px;
    const main_y = avatar_h + avatar_y;
    const main_w = 550 * px;
    const main_h = ch - (avatar_h / 2 + avatar_y) - 40 * px
    ctx.beginPath()
    var gra = ctx.createLinearGradient(0, 0, cw, ch)
    gra.addColorStop(0.1, "#ABDCFF");
    gra.addColorStop(1, "#0396FF");
    // ctx.fillStyle = gra;
    ctx.setFillStyle('rgb(48,191,109)')
    ctx.fillRect(0, 0, cw, ch)
    ctx.setFillStyle('#fafafa')
    ctx.fillRect(main_x, main_y - avatar_h / 2, main_w, main_h)
    ctx.arc(avatar_w / 2 + avatar_x, avatar_h / 2 + avatar_y, avatar_w / 2 + 5 * px, 0, Math.PI * 2, false);
    ctx.setFillStyle('white')
    ctx.fill()
    ctx.closePath();
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatar_w / 2 + avatar_x, avatar_h / 2 + avatar_y, avatar_w / 2, 0, Math.PI * 2, false);
    ctx.clip()
    ctx.closePath()
    ctx.drawImage(this.data.url, avatar_x, avatar_y, avatar_w, avatar_h)
    ctx.restore();
    // ctx.drawImage('../../asset/pic/bangdan.jpg', main_x + 30 * px, main_y + 60 * px, 100 * px, 100 * px);

    ctx.setFillStyle('black'); // 文字颜色
    ctx.font = `normal bold ${parseInt(42*px)}px Microsoft YaHei`;
    const name = `${app.globalData.nickName}`;
    const nw = ctx.measureText(name);
    console.log(nw)
    ctx.fillText(name, main_x + main_w / 2 - nw.width / 2, main_y + 60 * px);

    ctx.font = `normal bold ${parseInt(36*px)}px Microsoft YaHei`;
    const text = "昨日消耗电费";
    const tw = ctx.measureText(text);
    ctx.font = `normal bold ${parseInt(50*px)}px Microsoft YaHei`;
    const number = `${this.data.rank.con}`;
    const numw = ctx.measureText(number);
    ctx.font = `normal bold ${parseInt(36*px)}px Microsoft YaHei`;
    const yuan = "元";
    const yuanw = ctx.measureText(yuan);
    const s_center = tw.width + numw.width + yuanw.width + 20 * px + 40 * px;
    ctx.font = `normal bold ${parseInt(36*px)}px Microsoft YaHei`;
    ctx.fillText(text, main_x + (main_w - s_center) / 2, main_y + 160 * px);

    ctx.setFillStyle("red")
    ctx.font = `normal bold ${parseInt(50*px)}px Microsoft YaHei`;
    ctx.fillText(number, main_x + (main_w - s_center) / 2 + tw.width + 20 * px, main_y + 160 * px);

    ctx.setFillStyle('black');
    ctx.font = `normal bold ${parseInt(36*px)}px Microsoft YaHei`;
    ctx.fillText(yuan, main_x + (main_w - s_center) / 2 + tw.width + numw.width + 40 * px, main_y + 160 * px);

    // const s_center = tw.width+numw.width+yuanw.width+20*px+40*px;
    ctx.font = `normal bold ${parseInt(36*px)}px Microsoft YaHei`;
    const longtext = "超越了";
    const ltw = ctx.measureText(longtext);

    ctx.font = `normal bold ${parseInt(50*px)}px Microsoft YaHei`;
    const percent = `${this.data.rank.percen}%`;
    const pw = ctx.measureText(percent);
    ctx.font = `normal bold ${parseInt(36*px)}px Microsoft YaHei`;
    const cotext = "的寝室";
    const ctw = ctx.measureText(longtext);
    const c_center = ltw.width + pw.width + ctw.width + 20 * px + 60 * px;

    ctx.setFillStyle('black');
    ctx.font = `normal bold ${parseInt(36*px)}px Microsoft YaHei`;
    ctx.fillText(longtext, main_x + (main_w - s_center) / 2 + (s_center - c_center) / 2, main_y + 230 * px);

    ctx.setFillStyle('red');
    ctx.font = `normal bold ${parseInt(50*px)}px Microsoft YaHei`;
    ctx.fillText(percent, main_x + (main_w - s_center) / 2 + ltw.width + 20 * px + (s_center - c_center) / 2, main_y + 230 * px);

    ctx.setFillStyle('black');
    ctx.font = `normal bold ${parseInt(36*px)}px Microsoft YaHei`;
    ctx.fillText(cotext, main_x + (main_w - s_center) / 2 + ltw.width + pw.width + 40 * px + (s_center - c_center) / 2, main_y + 230 * px);

    const shareurl =  this.data.rank.percen / 100> 0.5 ? '../../asset/pic/nocold.png':'../../asset/pic/shengdian.png';
    console.log(percent)
    ctx.drawImage(shareurl, main_x + (main_w - 330 * px) / 2, main_y + 270 * px, 330 * px, 330 * px);

    ctx.drawImage('../../asset/pic/share_code.png', main_w - 110 * px, main_y + main_h - 170 * px - avatar_h / 2, 150 * px, 150 * px);

    ctx.font = `normal ${parseInt(24*px)}px Microsoft YaHei`;
    const sharetext = "长按识别小程序码";
    ctx.setFillStyle('#a0a0a0');
    const stw = ctx.measureText(sharetext);
    console.log(stw)
    ctx.fillText(sharetext, main_x + main_w - 180 * px - stw.width, main_y + main_h - 100 * px - avatar_h / 2);

    const slogan = "打开上应小风筝，享受便利校园";
    ctx.setFillStyle('#a0a0a0');
    const slw = ctx.measureText(slogan);
    console.log(stw)
    ctx.fillText(slogan, main_x + main_w - 180 * px - slw.width, main_y + main_h - 60 * px - avatar_h / 2);
    ctx.draw(false, function () {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          success(res) {
            that.setData({
              tempfile: res.tempFilePath
            })
          },
          fail:function(){
            wx.showToast({
              title: '绘制失败',
            })
          },
          complete:function(){
            // wx.hideToast();
            wx.hideLoading();
          }
        })
      }, 500);
    })
  },

  px: function () {
    return this.data.globalwidth / 750;
    // return 0.5;
  },
  share: function () {
    const that = this;
    wx.previewImage({
      current: `${that.data.tempfile}`, // 当前显示图片的http链接
      urls: [ `${that.data.tempfile}`] // 需要预览的图片http链接列表
    })
  },
  saveShareImg: function () {
    let that = this;
    // 获取用户是否开启用户授权相册
    if (!openStatus) {
      wx.openSetting({
        success: (result) => {
          if (result) {
            if (result.authSetting["scope.writePhotosAlbum"] === true) {
              openStatus = true;
              wx.saveImageToPhotosAlbum({
                filePath: that.data.tempfile,
                success() {
                  wx.showToast({
                    title: '图片保存成功，快去分享到朋友圈吧~',
                    icon: 'none',
                    duration: 2000
                  })
                },
                fail() {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                  })
                }
              })
            }
          }
        },
        fail: () => { },
        complete: () => { }
      });
    } else {
      wx.getSetting({
        success(res) {
          // 如果没有则获取授权
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                openStatus = true
                wx.saveImageToPhotosAlbum({
                  filePath: that.data.tempfile,
                  success() {
                    wx.showToast({
                      title: '图片保存成功，快去分享到朋友圈吧~',
                      icon: 'none',
                      duration: 2000
                    })
                  },
                  fail() {
                    wx.showToast({
                      title: '保存失败',
                      icon: 'none'
                    })
                  }
                })
              },
              fail() {
                // 如果用户拒绝过或没有授权，则再次打开授权窗口
                openStatus = false
                console.log('请设置允许访问相册')
                wx.showToast({
                  title: '请设置允许访问相册',
                  icon: 'none'
                })
              }
            })
          } else {
            // 有则直接保存
            openStatus = true
            wx.saveImageToPhotosAlbum({
              filePath: that.data.tempfile,
              success() {
                wx.showToast({
                  title: '图片保存成功，快去分享到朋友圈吧~',
                  icon: 'none',
                  duration: 2000
                })
              },
              fail() {
                wx.showToast({
                  title: '保存失败',
                  icon: 'none'
                })
              }
            })
          }
        },
        fail(err) {
          console.log(err)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})