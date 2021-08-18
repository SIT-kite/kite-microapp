// freshman/components/card.js

const timeUtils = require("../../../utils/timeUtils");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 姓名
    name: {
      type: String,
    },
    // 好友的 QQ 号
    qq: {
      type: String,
      value: null
    },
    // 好友的微信号
    wechat: {
      type: String,
      value: null
    },
    // 好友的手机号
    telphone: {
      type: String,
      value: null
    },
    // 好友的头像
    avatarImage: {
      type: String
    },
    // 来自的区域, 具体内容取决于数据源, 可能是省、市或精确到县、乡
    region: {
      type: String
    },
    // 性别. M 表示 male, F 表示 Female
    gender: {
      type: String
    },
    // 宿舍楼号, 本条目仅在 "新的班级" 页面展示
    // 和 "寝室号" 二选一
    building: {
      type: String,
      value: null,
    },
    // 寝室号, 默认值为空. 该字段仅在 "室友查询（新的朋友）" 页需要填写
    // 与 "宿舍楼号" 使用同一位置
    roomNumber: {
      type: String,
      value: ''
    },
    // 该用户上次登录的时间戳
    lastSeen: {
      type: String,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lastSeenText: null,
    genderImage: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 根据性别返回性别图标的路径
     * @param { String } gender 性别. "M" 为男, "F" 为女
     */
    _getGenderIconPath(gender) {
      if (gender === "M")
        return '/freshman/assets/male.png';
      else if (gender === "F")
        return '/freshman/assets/female.png';

      console.error(`Invalid gender string ${gender} passed to _getGenderIconPath`);
    },

    copy(e) {
      const dataset = e.target.dataset;
      wx.setClipboardData({
        data: dataset.text,
        success: () => wx.showToast({
          title: `复制${dataset.type}成功`
        })
      });
    }

  },

  /**
   * 组件创建时的响应事件
   */
  lifetimes: {

    attached() {
      this.setData({
        // 根据该用户上次访问时间, 算出时间差, 并转换成字符串
        lastSeenText: timeUtils.getIntervalToCurrentTime(this.properties.lastSeen),
        // 根据性别数据得到对应的 icon
        genderImage: this._getGenderIconPath(this.properties.gender),
      });
    }

  }
})
