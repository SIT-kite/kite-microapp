import { formatTime } from "../../../utils/util";
import {
  handlerGohomeClick,
  handlerGobackClick
} from "../../../utils/navBarUtils";

Page({
  data:{
    currentView:0,
    calendarShowing:false,
    dateSelected:'',
    isExpanding:false,
    //mock data
    schedules:[{
      userID:1,
      scheduleID:1,
      origin:'起点',
      destination:'目的地',
      date:'2020-6-6',
      sex:'男',
      time:'9:00',
      mates:[{
        userID:'',
        sex:'女',
        telephone:''
      },{
        userID:'',
        sex:'男',
        telephone:''
      }],
      status:'raise', // options:raise||finish
      purposeRaiseNum:3,
    },{
      origin:'起点',
      destination:'目的地',
      date:'2020-6-6',
      sex:'女',
      time:'9:00',
      mates:[{
        userID:'',
        sex:'女',
        telephone:''
      }],
      status:'raise', // options:raise||finish
      purposeRaiseNum:3,
    }],
    initiateSchedules:[{
      origin:'起点',
      destination:'目的地',
      date:'2020-6-6',
      time:'9:00',
      sex:'男',
      mates:[{
        userID:'',
        sex:'女',
        telephone:''
      },{
        userID:'',
        sex:'男',
        telephone:''
      }],
      purposeRaiseNum:3,
      status:'raise' // options:raise||finish
    },{
      origin:'起点',
      destination:'目的地',
      date:'2020-6-6',
      sex:'男',
      mates:[{
        userID:'',
        sex:'女',
        telephone:''
      },{
        userID:'',
        sex:'男',
        telephone:''
      }],
      purposeRaiseNum:3,
      time:'9:00',
      status:'finish' // options:raise||finish

    }],
    participateSchedules:[{
      userID:'',
      origin:'起点',
      destination:'目的地',
      date:'2020-6-6',
      sex:'女',
      mates:[{
        userID:'',
        sex:'女',
        telephone:''
      },{
        userID:'',
        sex:'男',
        telephone:''
      }],
      purposeRaiseNum:3,
      time:'9:00',
      status:'raise' // options:raise||finish
    }],
    //分页查询
    pagingQuery:0,
    inProfileType:'initiate',
    directions:['离校','返校','校区往返'],
    directionSelected:"",
    campuses:['奉贤校区','徐汇校区'],
    campusSelected:"",
    stations:['虹桥','浦东机场','上海南站','上海西站','上海站'],
    stationSelected:"",
    subways:['奉贤新城','沈杜公路'],
    subwaySelected:"",
  },
  
  OnClickDetails: () => {
    wx.navigateTo({
      url: '../car-pooldetail/car-pooldetail',
    })
  },

  // 导航栏函数
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick,

  onClickSubmit: () => {
    wx.showModal({
      title: '提交成功',
      showCancel: false,
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //处理选择了那些过滤选项
  tagChange(e){
    const {groupBy,content,selected} = e.detail
    this.setData({
      [groupBy+'Selected']:selected && content
    })
  },
  //切换拼车和我的
  toggleView(e){
    this.setData({
      currentView:e.target.dataset.index || e.detail.current
    })
  },
  //切换我参与的拼车和我发起的拼车
  toggleSubView(e){
    const inProfileType = e.target.dataset.subtype
    this.setData({
      inProfileType
    })
  },
  //显示日历组件
  selectedDate(){
    this.setData({
      calendarShowing:true
    })
  },
  //日历的选择和取消
  dateSelect(e){
    const dateSelected = formatTime(e.detail)
    this.setData({
      dateSelected
    })
  },
  dateUnselect(){
    this.setData({
      dateSelected:''
    })
  },
  //伸缩过滤容器
  expand(){
    this.setData({
      isExpanding:!this.data.isExpanding
    })
  },
  //TODO:发布拼车
  publish(){
    
  },
  //TODO:拼车联系
  contact(e){
    console.log(e.detail)
   
  }

})