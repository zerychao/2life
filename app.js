var request = require("/utils/request.js")
var util = require("/utils/util.js")

var sendLoginCode = res => {
  request.sendLoginCode(res.code)
}

//app.js
App({
  onLaunch: function () {
    // 清除无效缓存
    util.removeInvalidStorage()

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('loginCode: ' + res.code)
        sendLoginCode(res)
      }
    })
  },
  globalData: {
    userInfo: null
  }
})