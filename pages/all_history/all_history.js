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
    system: 20
  },
  onLoad: function () {
    this.setData(getData(util.getStoredUserInfo()))
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
  editDiary: function (e) {
    var diary_id = e.currentTarget.dataset.diaryid
    request.getFullDiary(diary_id, {
      success: (res) => {
        util.storeEditingDiaryId(diary_id)
        util.storeEditingDiaryTitle(res.data.data.diary.title)
        util.storeEditingDiaryText(res.data.data.diary.content)
        wx.navigateBack()
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
