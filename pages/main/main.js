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

var refresh = (that) => {
  that.setData({
    diaryList: util.parseDiaryData.dateToDayWeekday(util.getStoredRecentHistory()),
    save: "Save",
    diaryTitle: wx.getStorageSync('main_editing_diary_title'),
    diaryText: wx.getStorageSync('main_editing_diary_text'),
    showPair: wx.getStorageSync('user_match')
  })
}

var order = ['red', 'yellow', 'blue', 'green', 'red']
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    save: "Save",
    system: 20,
    showPair: wx.getStorageSync('user_match')
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
    refresh(this)
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
  updateDiaryTitle: function (e) {
    wx.setStorageSync('main_editing_diary_title', e.detail.value)
  },
  updateDiaryText: function (e) {
    wx.setStorageSync('main_editing_diary_text', e.detail.value)
  },
  savediary: function () {
    var storedEditingDiary = util.getStoredEditingDiary()
    if (storedEditingDiary.title == '' && storedEditingDiary.content == '') {
      util.showUI.showNullInputNotice()
    } else {
      this.setData({
        save: "Saving"
      })
      var nowEditingId = wx.getStorageSync('main_editing_diary_id')
      if (nowEditingId == '' || nowEditingId == -1) {
        request.saveNewDiary({
          success: res => {
            this.setData({
              showPair: util.getStoredMatch()
            })
            util.removeInvalidStorage()
            refresh(this, res)
          }
        })
      } else {
        request.saveEditedDiary(nowEditingId, {
          success: res => {
            util.removeInvalidStorage()
            refresh(this, res)
          }
        })
      }
    }
  },
  editDiary: function (e) {
    var diary_id = e.currentTarget.dataset.diaryid
    request.getFullDiary(diary_id, {
      success: (res) => {
        wx.setStorageSync('main_editing_diary_id', diary_id)
        wx.setStorageSync('main_editing_diary_title', res.data.data.diary.title)
        wx.setStorageSync('main_editing_diary_text', res.data.data.diary.content)
        this.setData({
          save: "Save",
          diaryTitle: res.data.data.diary.title,
          diaryText: res.data.data.diary.content
        })
      }
    })
  },
  deleteDiary: function(e) {
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
  },
  turnToAllhistory: function () {
    util.removeInvalidStorage()
    wx.navigateTo({
      url: '../all_history/all_history',
    })
  }
})

