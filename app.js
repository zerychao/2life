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
  },
  globalData: {
    userInfo: null,
    isLogin: false,
    editingDiary: {
      diaryId: -1,
      title: "",
      text: ""
    }
  }
})