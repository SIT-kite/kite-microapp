// phone/pages/phone.js
// TODO
//   已完成 基本框架样式、请求、缓存、30天更新、复制拨打 ，搜索、菜单跟随、菜单弹出
//   未完成 UI优化、搜索时标题隐藏、wx:key报警、动画优化
import { navHome, navBack } from "../../../utils/navBarUtils";
import getHeader from "../../../utils/getHeader";
import request from "../../../utils/request";

const app = getApp();
const availableSuffix = "/contact";

const departmentMap = new Map([
  [ "资产与实验室管理处", "资产处" ],
  [ "信息化技术中心",     "信息办" ],
  [ "国际交流处",         "国交处" ],
  [ "学生工作部",         "学工部" ],
  [ "科学技术研究院",     "科研院" ],
  [ "安全保卫处",         "保卫处" ],
  [ "后勤保障与服务中心", "后保处" ],
  [ "校长办公室",         "校办"   ],
  [ "党委办公室",         "党委"   ]
]);

let dataChange = []
let department = []
let contact_data = []
let date = 0
let newdate = 0
let choosedData = "研究生院"
let departmentChange = []
let isHidden = true;
let click = 1;

Page({

  data: {
    department,
    contact_data,
    date,
    newdate,
    choosedData, departmentChange, isHidden, dataChange, click
  },

  navHome,
  navBack,

  fetchData() {
    date = Date.now() + 2592000000;
    wx.setStorageSync("contact_date", date);
    this.setData({ date });
    request({
      url: `${app.globalData.apiUrl}${availableSuffix}`,
      header: getHeader("urlencoded", app.globalData.token)
    }).then(res => {
      const data = res.data.data.contacts;
      this.classification(data);
      this.setData({ data, contact_data: data })
      wx.setStorageSync("contact_data", data);
    })
  },

  // 设置 dataChange 和 departmentChange
  classification(contacts) {
    const dataChange = [];
    const departmentChange = this.data.departmentChange;

    contacts.forEach(contact => {

      // 如果 departmentMap 中有对应的缩写，就将部门名称转为缩写
      const shortDpmt = departmentMap.get(contact.department);
      if (shortDpmt !== undefined) contact.department = shortDpmt;

      const department = contact.department;

      // TODO：修改整体逻辑，简化下面的代码
      if (departmentChange.includes(department)) {
        dataChange.forEach(
          el =>
            el.department === department &&
            el.origin.push(contact)
        );
      } else {
        dataChange.push({ department, origin: [contact] });
        departmentChange.push(contact.department);
      }

      contact.isShow = true;

    })

    this.setData({ dataChange, departmentChange })
  },

  onLoad() {

    let newdate = Date.parse(new Date());
    let date = wx.getStorageSync('contact_date');
    this.setData({ newdate, date });

    let data = wx.getStorageSync('contact_data')
    this.setData({ data, contact_data: data })
    if (contact_data.length === 0 || date < newdate) {
      this.fetchData();
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
    if (phone === "") {
      app.msg("电话号码为空，无法拨打");
    } else {
      if (!phone.startsWith("0")) { phone = "021" + phone; }
      wx.makePhoneCall({ phoneNumber: phone });
    }
  },

  copy(e) {
    let phone = e.currentTarget.dataset.phone;
    if (phone === "") {
      app.msg("电话号码为空，无法复制");
    } else {
      if (!phone.startsWith("0")) { phone = "021" + phone; }
      wx.setClipboardData({ data: phone });
    }
  },

  tapdata(e) {
    const department = e.currentTarget.dataset.department
    const index = this.data.departmentChange.indexOf(department)
    this.setData({ choosedData: department, toView: 'index' + index })
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
      list[i].isHidden = count[i] === list[i].origin.length;
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
