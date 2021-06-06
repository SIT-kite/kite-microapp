// components/tabs/tabs/index.js
Component({
  properties: {
    defaultView: {
      type: String,
      value: ''
    }
  },
  relations: {
    "../tabpanel/index": {
      type: 'child',
      linked: function (target) {
        this._init(target)
      },
    }
  },
  data: {
    currentIndex: 0,
    titles: [],
    keys: [],
    childs: []
  },
  observers: {
    currentIndex(currentIndex) {}
  },
  lifetimes: {
    attached() {}
  },
  methods: {
    _init(target) {
      const {
        title,
        key
      } = target.data
      this._initTitle(title)
      this._initKey(key)
      this._initChilds(target)
      this._initCurrentView()
      this.data.childs[0]._show()
    },
    _initTitle(title) {
      const titles = this.data.titles
      titles.push(title)
      this.setData({
        titles
      })
    },
    _initKey(key) {
      const keys = this.data.keys
      keys.push(key)
      this.setData({
        keys
      })
    },
    _initChilds(target) {
      const childs = this.data.childs
      childs.push(target)
      this.setData({
        childs
      })
      console.log(`child ${target.data.key} 插入`, target)
    },
    _initCurrentView() {
      const defaultView = this.properties.defaultView
      const {
        keys,
        childs
      } = this.data
      let currentIndex = keys.indexOf(defaultView)
      console.log(currentIndex)
      if (currentIndex != -1) {
        childs[currentIndex]._show()
      }
    },

    changeTabpanel(e) {
      const currentIndex = e.currentTarget.dataset.index
      const previousIndex = this.data.currentIndex
      const keys = this.data.keys
      const previousChild = this.data.childs[previousIndex]
      const currentChild = this.data.childs[currentIndex]
      currentChild._show()
      previousIndex != currentIndex && previousChild._hide()
      this.setData({
        currentIndex
      })
      this.triggerEvent("onChange", {
        key:keys[currentIndex],
        currentIndex
      })
    }
  },
  options: {
    multipleSlots: true
  }
})