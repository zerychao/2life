var app = getApp()

var util = require("../../utils/util.js")
var dummyData = require("../../utils/dummy_data.js")
var request = require("../../utils/request.js")

var getData = (userInfo) => {
  return {
    userInfo: userInfo,
    hasUserInfo: true,
    diaryList: util.parseDiaryData.dateToDayWeekday(util.getStoredRecentHistory())
  }
}

Page({
  data: {
    userInfo: {},
    inputValue: "",
    mesArray: [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    system: 30,
    showModalStatus: false
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
            "system": 10
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
      hasUserInfo: true,
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value,
      inputSign: true
    });

  },

  sendMes: function () {
    var oriMesArr = this.data.mesArray;
    var newMes = this.data.inputValue;
    if (newMes != "") {
      var myNewMes = {
        mesType: "myItem",
        mesitem: {
          userInfo: this.data.userInfo,
          mes: newMes
        }
      };
      oriMesArr.push(myNewMes);
      this.setData({ mesArray: oriMesArr });
      this.setData({ inputValue: "" });
    }
  },

  showMenu: function () {
    util.showUI.showPairDetailsMenu({
      success: res => {
        switch(res.tapIndex) {
          case 0:
            wx.chooseImage()
            break;
          case 1:
            request.unpair({
              success: res1 => {
                wx.navigateBack()
              }
            })
            break;
        }
      }
    })
  }

})
