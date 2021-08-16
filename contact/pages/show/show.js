// phone/pages/phone.js
//TODO 已完成 基本框架样式、请求、缓存、30天更新、复制拨打 ，搜索、菜单跟随、菜单弹出 未完成 UI优化、搜索时标题隐藏、wx:key报警、动画优化
import {
    handlerGohomeClick,
    handlerGobackClick
}from'../../../utils/navBarUtils';
import getHeader from "../../../utils/getHeader";

const app = getApp();
const availableSuffix = `/contact`;
const requestUtils = require("../../../utils/requestUtils");
const promisify = require('../../../utils/promisifyUtils');

let dataChange=[]
let department=[]
let mydata=[]
let date = 0
let newdate =0
let chooseddata = "研究生院"
let departmentChange= []
let isHidden = true;
let click =1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
department,mydata,date,newdate,chooseddata,departmentChange,isHidden,dataChange,click
  },
//导航栏函数
handlerGohomeClick: handlerGohomeClick,
handlerGobackClick: handlerGobackClick,
    setdata: function(){
        let _this = this
        _this.setDate();
        let url = `${app.globalData.commonUrl}${availableSuffix}`;
        let header = getHeader("urlencoded", app.globalData.token);
        let data = {};
        let tapDate = requestUtils.doGET(url, data, header);
        tapDate.then((res) =>{
            data = res.data.data
            _this.classification(data);
            _this.setData({
                data: data,
                mydata : data
            })
            wx.setStorage({
                key: 'mydata',
                data: data
            })
        })
    },
    setDate: function (){
        let _this = this
        let date = _this.data.date
        date = Date.parse(new Date());
        date = date + 2592000000;
        wx.setStorageSync('mydate', date);
        _this.setData({date})
    },
    classification: function (frag_data){
        let dataChange=[]
        let departmentChange= this.data.departmentChange
        frag_data = frag_data.map(el=>{
            if(el.department == '资产与实验室管理处'){el.department = '资产处';return el;}
            else if(el.department == '信息化技术中心'){el.department = '信息办';return el;}
            // else if(el.department == '国际交流处'){el.department = '国交处';return el;}
            else if (el.department == '学生工作部'){el.department = '学工部';return el;}
            else if(el.department == '科学技术研究院'){el.department = '科研院';return el;}
            else if(el.department == '安全保卫处'){el.department = '保卫处';return el;}
            else if(el.department == '后勤保障与服务中心'){el.department = '后保处';return el;}
            else if(el.department == '校长办公室'){el.department = '校办';return el;}
            else if(el.department == '党委办公室'){el.department = '党委';return el;}
            else{return el}
        })
        for (let i = 0; i < frag_data.length; i++) {
            if(departmentChange.indexOf(frag_data[i].department)===-1){
                frag_data[i].isShow = true
                dataChange.push({
                    department: frag_data[i].department,
                    origin : [frag_data[i]]
                })
                departmentChange.push( frag_data[i].department)
            }else{
                for(let j = 0; j < dataChange.length;j++){
                    frag_data[i].isShow = true;
                    if(dataChange[j].department == frag_data[i].department){
                        dataChange[j].origin.push(frag_data[i]);
                    }
                }}
            }
        
    this.setData({
        dataChange:dataChange,
        departmentChange:departmentChange
    })
        },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let mydata = _this.data.mydata
    let date = _this.data.date
    let newdate = _this.data.newdate
    newdate = Date.parse(new Date());
    date =  wx.getStorageSync('mydate');
    _this.setData({newdate,date});
    mydata=wx.getStorageSync('mydata')
    _this.setData({
        data: mydata,
        mydata
    })
    if(mydata.length==0 || date<newdate){
        _this.setdata();
        _this.setData({newdate,date});
    }else{_this.classification(mydata);}
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

  },
    call:function(e){
    let phone = e.currentTarget.dataset.phone
    if(phone == ''){
        app.msg("电话号码为空，无法拨打")
        return
    }
    wx.makePhoneCall({
        phoneNumber: phone
    })
    },

    copy:function(e){
    let phone = e.currentTarget.dataset.phone
    wx.setClipboardData({
        data: phone
    })
    },
    tapdata: function(e){
        let _this = this
        const department = e.currentTarget.dataset.department
        const index = _this.data.departmentChange.indexOf(department)
        _this.setData({chooseddata : department,toView : 'index'+index})
    },
    search: function (e) {
        const _this=this
        let val = e.detail.value
        let list = _this.data.dataChange
        let count = 0
        for (let i = 0; i < list.length; i++) {
            for(let j = 0; j < list[i].origin.length; j++){
                if(list[i].origin[j].department.search(val) !=-1 || list[i].origin[j].phone.search(val) != -1){
                    list[i].origin[j].isShow = true
                } else{
                    list[i].origin[j].isShow = false
                }
            }
        }
        this.setData({
            dataChange: list
        })
    },

    router: function(e){
        click= this.data.click
        if(click == 1){
            click =2;
            this.setData({clicked : 1,click});} 
        else if(click==2){
            click=1;
            this.setData({clicked : 2,click});
        }
    setTimeout(() => this.setData({ clicked: -1 }), 1000);
    } 
})