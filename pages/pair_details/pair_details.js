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

var scrollToBottom = that => {
  that.setData({ messageSVScrollTop: 9007199254740992 })
}

var sendMessage = (newMes, that) => {
  var oriMesArr = that.data.mesArray;
  if (newMes != "") {
    var myNewMes = {
      mesType: "myItem",
      mesitem: {
        userInfo: that.data.userInfo,
        mes: newMes
      }
    };
    oriMesArr.push(myNewMes);
    that.setData({ mesArray: oriMesArr });
    that.setData({ inputValue: "" });
    request.sendMessageViaHttp(newMes, {
      success: res => {
        refresh(that)
        scrollToBottom(that)
      }
    })
  }
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
    scrollToBottom(this)
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
    sendMessage(this.data.inputValue, this)
  },

  sendDiary: function (e) {
    var that = this
    var diary_id = e.currentTarget.dataset.diaryid
    request.getFullDiary(diary_id, {
      success: (res) => {
        sendMessage(res.data.data.diary.title + '\n=========\n' + res.data.data.diary.content, that)
      }
    })
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
