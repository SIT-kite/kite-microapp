// phone/pages/phone.js
// TODO
//   已完成 基本框架样式、请求、缓存、30天更新、复制拨打 ，搜索、菜单跟随、菜单弹出
//   未完成 UI优化、搜索时标题隐藏、wx:key报警、动画优化
import { handlerGohomeClick, handlerGobackClick } from "../../../utils/navBarUtils";
import getHeader from "../../../utils/getHeader";
import request from "../../../utils/request";

const app = getApp();
const availableSuffix = "/contact";

let dataChange = []
let department = []
let contact_data = []
let date = 0
let newdate = 0
let chooseddata = "研究生院"
let departmentChange = []
let isHidden = true;
let click = 1;

Page({

  data: {
    department, contact_data, date, newdate, chooseddata, departmentChange, isHidden, dataChange, click
  },

  handlerGohomeClick,
  handlerGobackClick,

  setdata() {
    let _this = this
    _this.setDate();
    request({
      url: `${app.globalData.commonUrl}${availableSuffix}`,
      header: getHeader("urlencoded", app.globalData.token)
    }).then((res) => {
      const data = res.data.data.contacts;
      _this.classification(data);
      _this.setData({
        data: data,
        contact_data: data
      })
      wx.setStorage({
        key: 'contact_data',
        data: data
      })
    })
  },
  setDate() {
    let _this = this
    let date = _this.data.date
    date = Date.parse(new Date());
    date = date + 2592000000;
    wx.setStorageSync('contact_date', date);
    _this.setData({ date })
  },

  classification(frag_data) {
    let dataChange = []
    let departmentChange = this.data.departmentChange
    frag_data = frag_data.map(el => {
      switch (el.department) {
        case "资产与实验室管理处": el.department = "资产处"; break;
        case "信息化技术中心":     el.department = "信息办"; break;
        // case "国际交流处":         el.department = "国交处"; break;
        case "学生工作部":         el.department = "学工部"; break;
        case "科学技术研究院":     el.department = "科研院"; break;
        case "安全保卫处":         el.department = "保卫处"; break;
        case "后勤保障与服务中心": el.department = "后保处"; break;
        case "校长办公室":         el.department = "校办"; break;
        case "党委办公室":         el.department = "党委"; break;
      }
      return el;
    })
    for (let i = 0; i < frag_data.length; i++) {
      if (departmentChange.indexOf(frag_data[i].department) === -1) {
        frag_data[i].isShow = true
        dataChange.push({
          department: frag_data[i].department,
          origin: [frag_data[i]]
        })
        departmentChange.push(frag_data[i].department)
      } else {
        for (let j = 0; j < dataChange.length; j++) {
          frag_data[i].isShow = true;
          if (dataChange[j].department === frag_data[i].department) {
            dataChange[j].origin.push(frag_data[i]);
          }
        }
      }
    }

    this.setData({
      dataChange,
      departmentChange
    })
  },

  onLoad() {
    let {contact_data, date, newdate} = this.data;
    newdate = Date.parse(new Date());
    date = wx.getStorageSync('contact_date');
    this.setData({ newdate, date });
    contact_data = wx.getStorageSync('contact_data')
    this.setData({
      data: contact_data,
      contact_data
    })
    if (contact_data.length === 0 || date < newdate) {
      this.setdata();
      this.setData({ newdate, date });
    } else { this.classification(contact_data); }
  },

  // onReady() {},
  // onShow() {},

  // 生命周期函数--监听页面隐藏
  // onHide() {},

  // 生命周期函数--监听页面卸载
  // onUnload() {},

  // 页面相关事件处理函数--监听用户下拉动作
  // onPullDownRefresh() {},

  // 页面上拉触底事件的处理函数
  // onReachBottom() {},

  onShareAppMessage: () => ({
    title: "用上应小风筝，查看校内常用电话",
    path: "contact/pages/show/show"
  }),

  call(e) {
    let phone = e.currentTarget.dataset.phone;
    phone.substring(0,1) ==0?'':phone= '021'+phone
    if (phone == '') {
      app.msg("电话号码为空，无法拨打");
    } else {
      wx.makePhoneCall({ phoneNumber: phone });
    }
  },

  copy(e) {
    let phone = e.currentTarget.dataset.phone
    phone.substring(0,1) ==0?'':phone= '021'+phone
    wx.setClipboardData({ data: phone })
  },

  tapdata(e) {
    let _this = this
    const department = e.currentTarget.dataset.department
    const index = _this.data.departmentChange.indexOf(department)
    _this.setData({ chooseddata: department, toView: 'index' + index })
  },

  search(e) {
    const _this = this
    let val = e.detail.value
    let list = _this.data.dataChange
    let count = []
    for (let i = 0; i < list.length; i++) {
      let x = 0;
      for (let j = 0; j < list[i].origin.length; j++) {
        if (
          list[i].origin[j].department .search(val) !== -1 ||
          list[i].origin[j].phone      .search(val) !== -1 ||
          list[i].origin[j].description.search(val) !== -1
        ) {
          list[i].origin[j].isShow = true
        } else {
          list[i].origin[j].isShow = false;
          x += 1;
          count[i] = x;
        }
      }
      if(count[i] === list[i].origin.length) {
        list[i].isHidden = true
      }else{
        list[i].isHidden = false
      }
    }
    this.setData({ dataChange: list })
  },

  router() {
    click = this.data.click;
    if (click === 1) {
      click = 2;
      this.setData({ clicked: 1, click });
    } else if (click === 2) {
      click = 1;
      this.setData({ clicked: 2, click });
    }
    setTimeout(() => this.setData({ clicked: -1 }), 1000);
  },

  collapse() {
    if (this.data.click === 2) {
      this.setData({ click: 1 });
    }
  }

})
