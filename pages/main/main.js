//index.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util.js")
var dummyData = require("../../utils/dummy_data.js")
var request = require("../../utils/request.js")

var getData = (userInfo) => {
  return {
    userInfo: userInfo,
    hasUserInfo: true,
    diaryList: util.parseDiaryData.dateToDayWeekday(util.getStoredRecentHistory()),
    showPair: util.getStoredMatch()
  }
}

var order = ['red', 'yellow', 'blue', 'green', 'red']
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    save: "Save",
    system: 20,
    showPair: false
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData(getData(app.globalData.userInfo))
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData(getData(res.userInfo))
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData(getData(res.userInfo))
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
  bindDiaryTitleInput: (e) => {
    wx.setStorageSync('main_editing_diary_title', e.detail.value)
  },
  bindDiaryTextInput: (e) => {
    wx.setStorageSync('main_editing_diary_text', e.detail.value)
  },
  savediary: function () {
    this.setData({
      save: "Saving"
    })
    request.saveDiary({ 
      success: res => {
        this.setData({
          diaryList: util.parseDiaryData.dateToDayWeekday(res.data.data.diaries),
          save: "Saved",
          showPair: util.getStoredMatch(),
          diaryTitle: '',
          diaryText: ''
        })
        util.removeInvalidStorage()
      }
    })
  },
  turnToAllhistory: function () {
    wx.navigateTo({
      url: '../all_history/all_history',
    })
  }
})

