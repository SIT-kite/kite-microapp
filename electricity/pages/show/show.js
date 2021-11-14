// 电费查询
// electricity/pages/show/show.js
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import getHeader from "../../../utils/getHeader";

const app = getApp();
const gData = app.globalData;

const requestUtils = require("../../../utils/requestUtils");
// const { echarts } = requirePlugin('echarts');

const electricityApiUrl = `${gData.apiUrl}/pay/room/`;

Page({

  handlerGohomeClick,
  handlerGobackClick,

  data: {
    show: false,
    roomID: "",
    floorID: "",
    electricityData: {
      balance: 0,
      power: 0,
      room: 0,
      date: "",
      time: ""
    },
    showtype: '',
    option: {
      title: {
        text: "电费使用情况"
      },
      tooltip: {
        trigger: "axis",
        formatter: '在{b0}\n消费{c0}'
      },
      series: [{
        data: [],
        type: "line",
        markLine: {
          data: [{
            type: 'average',
            name: '平均值',
            symbol: "none"
          }]
        }
      }],
      xAxis: {
        data: [],
        type: "category",
        axisLabel: {
          interval: 3
        },
        boundaryGap: false
      },
      yAxis: {
        type: "value"
      }
    },
    message: "",
    selected: "hours",
    mhours: {
      title: {
        text: "电费使用情况"
      },
      tooltip: {
        trigger: "axis",
        formatter: '在{b0}\n消费{c0}'
      },
      series: [{
        data: [],
        type: "line",
        markLine: {
          data: [{
            type: 'average',
            name: '平均值',
            symbol: "none"
          }]
        }
      }],
      xAxis: {
        data: [],
        type: "category",
        axisLabel: {
          interval: 3
        },
        boundaryGap: false
      },
      yAxis: {
        type: "value"
      }
    },
    mdays: {
      title: {
        text: "电费使用情况"
      },
      tooltip: {
        trigger: "axis",
        formatter: '在{b0}\n消费{c0}'
      },
      series: [{
        data: [],
        type: "line",
        markLine: {
          data: [{
            type: 'average',
            name: '平均值',
            symbol: "none"
          }]
        }
      }],
      xAxis: {
        data: [],
        type: "category",
        axisLabel: {
          interval: 3
        },
        boundaryGap: false
      },
      yAxis: {
        type: "value"
      }
    },
    rank: {
      con: 0,
      percen: ' '
    },

    charge: 0
  },

  onClose() {
    this.setData({ show: false });
  },

  showWrongTip() {
    wx.showModal({
      title: "数据错误提示",
      content: "此数据来源于学校在线电费查询平台。如有错误，请以充值机显示金额为准。",
      showCancel: false
    })
  },

  goToShare() {
    const { con, percen } = this.data.rank;
    wx.navigateTo({ url: `../share/share?consumption=${con}&percent=${percen}` });
    // this.onInstance(echarts);
  },

  rpx2px(rpx) {
    const pixelRatio1 = 750 / wx.getSystemInfoSync().windowWidth;
    return rpx / pixelRatio1;
  },

  bindroomID(e) {
    this.setData({
      roomID: e.detail.value,
      show: false
    })
  },

  bindfloorID(e) {
    this.setData({
      floorID: e.detail.value,
      show: false
    })
  },

  getRoom() {
    const floor = parseInt(this.data.floorID);
    const room = parseInt(this.data.roomID);
    if (
      floor >= 1 && floor < 27 &&
      room / 100 >= 0 && room / 100 < 17
    ) {
      const result = `10${floor}${room}`;
      wx.setStorageSync('electricity_floor', floor);
      wx.setStorageSync('electricity_room', room);
      return result;
    } else {
      wx.showModal({
        content: "输入格式有误",
        showCancel: false
      })
      return 'error';
    }
  },

  getCostData(e) {
    const that = this;
    const type = e.currentTarget.dataset.type;
    const init = e.currentTarget.dataset.init;
    that.setData({
      selected: type
    })
    const room = that.getRoom();
    if (room === 'error') {
      return;
    }
    that.getrank();
    if (init) {
      that.setData({
        ['mhours.series[0].data']: [],
        ['mdays.series[0].data']: []
      })
    }
    if (that.data[`m${type}`].series[0].data.length !== 0) {
      const temp = that.data[`m${type}`]
      console.log(`m${type}`)
      console.log(temp)
      that.setData({
        option: temp,
        show: true,
        showtype: 'history'
      })
    } else {
      let url = `${electricityApiUrl}${room}/bill/${type}`;
      let header = getHeader("urlencoded", gData.token);
      let data = {};
      let getdata = requestUtils.doGET(url, data, header);
      // console.log(e.currentTarget.dataset.type)
      getdata.then((res) => {
        console.log(`开始请求${type}`)
        let tempdata = [];
        let tempx = [];
        let sum = 0;

        //存充值记录
        let charge = 0;

        for (let value of res.data.data) {
          //  console.log(value)
          sum += value.consumption;
          tempdata.push(value.consumption.toFixed(2));
          tempx.push(
            type === 'hours'
              ? value.time.split(' ')[1]
              : value.date.substr(5)
          );

          //存充值记录
          if(value.charge !== 0) charge = value.charge;
        }

        this.setData({charge:charge});

        if (type === 'days') {
          let moption = that.data.mdays;
          console.log("保留day数据")
          moption.series[0].data = tempdata;
          moption.xAxis.data = tempx;
          moption.xAxis.axisLabel.interval = 0
          that.setdays(moption)
          console.log(that.data.mdays)
        } else if (type === 'hours') {
          let aoption = that.data.mhours;
          aoption.series[0].data = tempdata;
          aoption.xAxis.data = tempx;
          aoption.xAxis.axisLabel.interval = 3
          that.sethours(aoption)
          // console.log(that.data.mhours)
          console.log(sum)
        }
      }).catch(() => {
        wx.showModal({
          content: "无对应房间数据",
          showCancel: false
        });
      })
    }
  },

  getrank() {
    const that = this;

    const room = that.getRoom();
    if (room === "error") {
      return;
    }

    let url = `${electricityApiUrl}${room}/rank`;
    let header = getHeader("urlencoded", gData.token);
    let data = {};
    requestUtils.doGET(url, data, header).then((res) => {
      const data = res.data.data
      const rank = data.rank;
      const total = data.room_count;
      let percen = ((total - rank) / total * 100).toFixed(2);
      that.setData({
        'rank.con': data.consumption.toFixed(2),
        'rank.percen': `${percen}`
      })
    }).catch(() => {
      that.setData({
        'rank.con':0,
        'rank.percen': 0
      })
      wx.showModal({
        content: "无对应房间数据",
        showCancel: false
      });
    })

  },

  sethours(moption) {
    console.log("保存了hours")
    this.setData({
      option: moption,
      mhours: moption,
      show: true,
      showtype: 'history'
    })
  },

  setdays(moption) {
    console.log("保存了days")
    this.setData({
      option: moption,
      mdays: moption,
      show: true,
      showtype: 'history'
    })
  },

  getEletricityConsume() {
    const room = this.getRoom();
    if (room === 'error') {
      return;
    }
    let url = `${electricityApiUrl}${room}`;
    let header = getHeader("urlencoded", gData.token);
    let data = {};
    requestUtils.doGET(url, data, header).then((res) => {
      const data = res.data.data;
      const dateTime = data.ts.split('T');
      this.setData({
        electricityData: {
          date: dateTime[0],
          time: dateTime[1].substr(0, 5),
          balance: data.balance.toFixed(2),
          power: data.power.toFixed(2),
          room: data.room
        },
        show: true,
        showtype: 'normal'
      });
    }).catch(() => {
      wx.showModal({
        content: "无对应房间数据",
        showCancel: false
      });
    })

  },

  /* showtips() {
    const tips = "'10'+1~2位楼号+3~4位房间号"
    wx.showModal({
      title: "填写格式",
      content: tips,
      showCancel: false
    })
  }, */

  onLoad() {
    this.setData({
      floorID: wx.getStorageSync('electricity_floor'),
      roomID: wx.getStorageSync('electricity_room')
    })
  },

  // onReady() {},

  onShow() {
    const { navBarHeight, navBarExtendHeight } = getApp().globalSystemInfo;
    this.setData({
      navBarCurrentHeight: navBarExtendHeight + navBarHeight
    });
  },

  onShareAppMessage: () => ({
    title: "试试用上应小风筝查电费吧！支持用电历史哦！",
    path: "pages/index/index"
  })

})
