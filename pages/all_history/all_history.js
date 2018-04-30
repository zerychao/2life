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
    diaryPartList: util.parseDiaryData.splitByDate(util.getStoredRecentHistory())
  }
}

var refresh = (that, res) => {
  that.setData({
    diaryPartList: util.parseDiaryData.splitByDate(res.data.data.diaries),
  })
  util.removeInvalidStorage()
}

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    system: 20
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
    request.getAllHistory()
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
  editDiary: function (e) {
    var diary_id = e.currentTarget.dataset.diaryid
    request.getFullDiary(diary_id, {
      success: (res) => {
        wx.setStorageSync('main_editing_diary_id', diary_id)
        wx.setStorageSync('main_editing_diary_title', res.data.data.diary.title)
        wx.setStorageSync('main_editing_diary_text', res.data.data.diary.content)
        wx.navigateTo({
          url: '../main/main',
        })
      }
    })
  },
  deleteDiary: function (e) {
    var that = this
    util.showUI.showDeleteConfirm({
      success: (res) => {
        if (res.confirm) {
          var diary_id = e.currentTarget.dataset.diaryid
          request.deleteDiary(diary_id, {
            success: res => {
              refresh(that, res)
            }
          })
        }
      }
    })
  }
})
