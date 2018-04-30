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

var refresh = (that, res) => {
  that.setData({
    diaryList: util.parseDiaryData.dateToDayWeekday(res.data.data.diaries),
    save: "Save",
    diaryTitle: '',
    diaryText: '',
    nowEditingId: -1
  })
  util.removeInvalidStorage()
}

var order = ['red', 'yellow', 'blue', 'green', 'red']
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    save: "Save",
    system: 20,
    showPair: false,
    nowEditingId: -1
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
  updateDiaryTitle: function (e) {
    wx.setStorageSync('main_editing_diary_title', e.detail.value)
  },
  updateDiaryText: function (e) {
    wx.setStorageSync('main_editing_diary_text', e.detail.value)
  },
  savediary: function () {
    var storedEditingDiary = util.getStoredEditingDiary()
    if (storedEditingDiary.title == '' && storedEditingDiary.content == '') {
      wx.showModal({
        title: 'Save',
        content: 'It seems that you didn\'t enter anything.',
        showCancel: false,
        confirmText: 'OK'
      })
    } else {
      this.setData({
        save: "Saving"
      })
      if (this.data.nowEditingId == -1) {
        request.saveNewDiary({ 
          success: res => {
            this.setData({
              showPair: util.getStoredMatch()
            })
            refresh(this, res)
          }
        })
      } else {
        request.saveEditedDiary(this.data.nowEditingId, {
          success: res => {
            refresh(this, res)
          }
        })
      }
    }
  },
  editDiary: function (e) {
    var index = e.currentTarget.id.split('_')[1]
    console.log(index)
    var diary_id = util.getStoredRecentHistory()[index].diary_id
    request.getFullDiary(diary_id, {
      success: (res) => {
        this.setData({
          save: "Save",
          diaryTitle: res.data.data.diary.title,
          diaryText: res.data.data.diary.content,
          nowEditingId: diary_id
        })
        wx.setStorageSync('main_editing_diary_title', res.data.data.diary.title)
        wx.setStorageSync('main_editing_diary_text', res.data.data.diary.content)
      }
    })
  },
  deleteDiary: function(e) {
    var that = this
    wx.showModal({
      title: 'Delete',
      content: 'Do you really want to delete this diary? It cannot be restored.',
      cancelText: 'Cancel',
      confirmText: 'Confirm',
      success: (res) => {
        if (res.confirm) {
          var index = e.currentTarget.id.split('_')[1]
          console.log(index)
          var diary_id = util.getStoredRecentHistory()[index].diary_id
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
    wx.navigateTo({
      url: '../all_history/all_history',
    })
  }
})

