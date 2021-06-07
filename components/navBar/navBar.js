const typeEmptyString = {
  type: String,
  value: ''
}, typeFalseBoolean = {
  type: Boolean,
  value: false
};

Component({

  options: {
    multipleSlots: true,
    addGlobalClass: true
  },

  properties: {
    extClass: typeEmptyString,
    background: {
      type: String,
      value: 'rgba(255, 255, 255, 1)',
      observer: '_showChange'
    },
    backgroundColorTop: {
      type: String,
      value: 'rgba(255, 255, 255, 1)',
      observer: '_showChangeBackgroundColorTop'
    },
    color: {
      type: String,
      value: 'rgba(0, 0, 0, 1)'
    },
    title: typeEmptyString,
    searchText: {
      type: String,
      value: '点我搜索'
    },
    searchBar: typeFalseBoolean,
    back: typeFalseBoolean,
    home: typeFalseBoolean,
    iconTheme: {
      type: String,
      value: 'black'
    },
    /* animated: {
      type: Boolean,
      value: true
    },
    show: {
      type: Boolean,
      value: true,
      observer: '_showChange'
    }, */
    delta: {
      type: Number,
      value: 1
    }
  },
  created() { this.getSystemInfo(); },
  attached() { this.setStyle();  }, // 设置样式

  data: {},

  pageLifetimes: {
    show() {
      if (getApp().globalSystemInfo.ios) {
        this.getSystemInfo();
        this.setStyle(); // 设置样式1
      }
    },
    hide() {}
  },

  methods: {
    setStyle(life) {

      const {
        statusBarHeight,
        navBarHeight,
        capsulePosition,
        navBarExtendHeight,
        ios,
        windowWidth
      } = getApp().globalSystemInfo;
      const { back, home, title } = this.data;

      let rightDistance = windowWidth - capsulePosition.right; // 胶囊按钮右侧到屏幕右侧的边距
      let leftWidth     = windowWidth - capsulePosition.left;  // 胶囊按钮左侧到屏幕右侧的边距

      const navigationbarinnerStyle = [
        `color: ${this.data.color}`,
        `background: ${this.data.background}`,
        `height: ${navBarHeight + navBarExtendHeight}px`,
        `padding-top: ${statusBarHeight}px`,
        `padding-right: ${leftWidth}px`,
        `padding-bottom: ${navBarExtendHeight}px`
      ].join(';');

      const navBarLeft = (
        back !== home ? [
          `width: ${capsulePosition.width}px`,
          `height: ${capsulePosition.height}px`
        ] : (back && home) || title ? [
          `width: ${capsulePosition.width}px`,
          `height: ${capsulePosition.height}px`,
          `margin-left: ${rightDistance}px`
        ] : [ `width: auto`, `margin-left: 0px` ]
      ).join(';');

      const data = {
        navigationbarinnerStyle,
        navBarLeft,
        navBarHeight,
        capsulePosition,
        navBarExtendHeight,
        ios
      };

      if (life === 'created') {
        this.data = data;
      } else {
        this.setData(data);
      }

    },
    _showChange () { this.setStyle(); },
    // 返回事件
    back() { this.triggerEvent('back', { delta: this.data.delta }) },
    home() { this.triggerEvent('home', {}); },
    search() { this.triggerEvent('search', {}); },

    getSystemInfo() {
      var app = getApp();
      if (app.globalSystemInfo && !app.globalSystemInfo.ios) {
        return app.globalSystemInfo;
      } else {
        let systemInfo = wx.getSystemInfoSync();
        let ios = !!(systemInfo.system.toLowerCase().search('ios') + 1);
        let rect;
        try {
          if (typeof wx.getMenuButtonBoundingClientRect !== 'function') {
            throw 'getMenuButtonBoundingClientRect error';
          }
          rect = wx.getMenuButtonBoundingClientRect();

          // 取值为0的情况  有可能width不为0 top为0的情况
          if (!rect.width || !rect.top || !rect.left || !rect.height) {
            throw 'getMenuButtonBoundingClientRect error';
          }
        } catch (error) {
          let gap = 4; // 胶囊按钮上下间距 使导航内容居中
          let width = 88;  // 胶囊的宽度
          let height = 32; // 胶囊的高度
          if (systemInfo.platform === 'android') {
            gap = 8;
            width = 96;
          } else if (systemInfo.platform === 'devtools') {
            // 开发工具中，ios手机5.5，android和其他手机7.5
            gap = ios ? 5.5 : 7.5;
          }
          if (!systemInfo.statusBarHeight) {
            // 开启wifi的情况下修复statusBarHeight值获取不到
            systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
          }
          const top = systemInfo.statusBarHeight + gap;
          rect = {
            // 获取不到胶囊信息就自定义重置一个
            width, height,
            top,
            bottom: top + height,
            left: systemInfo.windowWidth - width - 10,
            right: systemInfo.windowWidth - 10
          };
          console.log({ error, rect });
        }

        /* 导航栏高度 = 胶囊高度 + 高度差 * 2
        menu = wx.getMenuButtonBoundingClientRect() 
        system = wx.getSystemInfo
        导航栏高度 = menu.statusBarHeight + menu.height + (menu.top - menu.statusBarHeight) * 2
        */

        let navBarHeight = '';
        if (!systemInfo.statusBarHeight) {
          systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
          const gap = rect.top - systemInfo.statusBarHeight;
          navBarHeight = 2 * gap + rect.height;

          systemInfo.statusBarHeight = 0;
          systemInfo.navBarExtendHeight = 0;
        } else {
          const gap = rect.top - systemInfo.statusBarHeight;
          navBarHeight = 2 * gap + rect.height +  systemInfo.statusBarHeight;
          // ios下方扩展4像素高度 防止下方边距太小
          systemInfo.navBarExtendHeight = ios ? 4 : 0;
        }

        systemInfo.navBarHeight = navBarHeight; //导航栏高度不包括statusBarHeight
        systemInfo.capsulePosition = rect; /* 右上角胶囊按钮信息：
        bottom: 58 height: 32 left: 317 right: 404 top: 26 width: 87
        目前发现在大多机型都是固定值 为防止不一样 会使用动态值来计算nav元素大小 */
        systemInfo.ios = ios; //是否ios

        app.globalSystemInfo = systemInfo; //将信息保存到全局变量中,后边再用就不用重新异步获取了

        // console.log('systemInfo', systemInfo);
        return systemInfo;
      }
    }

  }

});
