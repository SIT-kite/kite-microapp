// components/tabs/tabpanel/index.js
Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    key: {
      type: String,
      value: ""
    },
  },
  relations: {
    "../tabs/index": {
      type: 'parent',
      linked:(target)=> {

      }
    }
  },
  data: {
    isShowing: false,
  },
  methods: {
    _show() {
      this.setData({
        isShowing: true
      })
    },
    _hide() {
      this.setData({
        isShowing: false
      })
    }
  }
})