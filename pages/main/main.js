//index.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util.js")
var dummyData = require("../../utils/dummy_data.js")

var order = ['red', 'yellow', 'blue', 'green', 'red']
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    save: "Save",
    system: 20
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        diaryList: util.parseDiaryData.dateToDayWeekday(dummyData.diaryList)
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          diaryList: util.parseDiaryData.dateToDayWeekday(dummyData.diaryList)
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
            diaryList: util.parseDiaryData.dateToDayWeekday(dummyData.diaryList)
          })
        }
      })
    }
  },
  onShow: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.system)
        var system = res.system.split(/ /)
        console.log("system: " + system[0])
        if (system[0] == "Android") {
          that.setData({
            "system": 0
          })
        }
      }
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  contact: function () {
    wx.navigateTo({
      url: '../pair_details/pair_details'
    })
  },
  savediary: function () {
    this.setData({
      "save": "Saved"
    });
  },
  turnToAllhistory: function () {
    wx.navigateTo({
      url: '../all_history/all_history',
    })
  }
})
