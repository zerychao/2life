//index.js
//获取应用实例
var dataObj=require("../../data/data.js")
const app = getApp()

var order = ['red', 'yellow', 'blue', 'green', 'red']
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    save:"save"
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        dairyList:dataObj.dairyList
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          dairyList: dataObj.dairyList
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            dairyList: dataObj.dairyList
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShow: function () {
    this.getwidth(); 
  },
  contact: function() {
    wx.navigateTo({
      url: '../pair_details/pair_details'
    })
  },
  getwidth: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData(that.data.s3_width = res.windowWidth / 3);
      },
    })
  },
  turnTopage: function() {
    wx.navigateTo({
      url: '../all_history/all_history'
    })
  },
  saveDairy: function() {
    this.setData({
        "save": "saved"
      });
  }
})
