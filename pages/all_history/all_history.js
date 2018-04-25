//index.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util.js")
var dummyData = require("../../utils/dummy_data.js")


Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
<<<<<<< HEAD
        diaryPartList: util.parseDiaryData(dummyData.dairyList)
=======
        diaryPartList: dataObj.diaryPartList
>>>>>>> 3ce65311f2e1d6a387c99fc8574316efd36fd4ec
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
<<<<<<< HEAD
          diaryPartList: util.parseDiaryData(dummyData.dairyList)
=======
          diaryPartList: dataObj.diaryPartList
>>>>>>> 3ce65311f2e1d6a387c99fc8574316efd36fd4ec
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
<<<<<<< HEAD
            diaryPartList: util.parseDiaryData(dummyData.dairyList)
=======
            diaryParList: dataObj.diaryPartList
>>>>>>> 3ce65311f2e1d6a387c99fc8574316efd36fd4ec
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
})
