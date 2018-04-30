var app = getApp()

var util = require("../../utils/util.js")
var dummyData = require("../../utils/dummy_data.js")
var request = require("../../utils/request.js")

var getData = (userInfo) => {
  console.log(util.parseMessageData(util.getStoredChatHistory()))
  return {
    userInfo: userInfo,
    hasUserInfo: true,
    diaryList: util.parseDiaryData.dateToDayWeekday(util.getStoredRecentHistory()),
    showPair: util.getStoredMatch(),
    pair: util.getStoredMatchUser(),
    mesArray: util.parseMessageData(util.getStoredChatHistory())
  }
}

var refresh = that => {
  that.setData({
    mesArray: util.parseMessageData(util.getStoredChatHistory()) 
  });
}

var timer

Page({
  data: {
    userInfo: {},
    inputValue: "",
    mesArray: [],
    hasUserInfo: false,
    system: 30,
    showModalStatus: false,
    showPair: util.getStoredMatch(),
    pair: util.getStoredMatchUser()
  },

  onLoad: function () {
    this.setData(getData(util.getStoredUserInfo()))
    timer = setInterval(() => {
      request.getChatHistory(util.getStoredChatroomId(), {
        success: res => {
          refresh(this)
        }
      })
    }, 5000)
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
  onUnload: function () {
    clearInterval(timer)
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value,
      inputSign: true
    });

  },

  sendMes: function () {
    var that = this
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
      request.sendMessageViaHttp(newMes, {
        success: res => {
          refresh(that)
        }
      })
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
