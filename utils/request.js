var util = require("../utils/util.js")

var doRequest = (method, shortUrl, data, callback, header) => {
  var that = this
  wx.request({
    url: util.getFullUrl(shortUrl),
    data: data,
    method: method,
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
    success: callback.success,
    fail: callback.fail,
    complete: callback.complete,
  })
}

var storeUserInfo = callback => {
  doRequest('POST', 'store_action', {
    openId: util.getStoredOpenId(),
    nickName: util.getStoredUserInfo('nickName'),
    avatarUrl: util.getStoredUserInfo('avatarUrl'),
    gender: util.getStoredUserInfo('gender'),
    province: util.getStoredUserInfo('province'),
    city: util.getStoredUserInfo('city'),
    country: util.getStoredUserInfo('country')
  }, {
    success: res => {
      console.log('storeUserInfo():')
      console.log(res.data)
      if (res.data.status === 'success') {
        console.log('Login complete.')
      }
    }
  })
}

var getFullUserInfo = (callback) => {
  doRequest('GET', 'get_user_action', {
    openId: util.getStoredOpenId()
  }, {
    success: res => {
      wx.setStorageSync('user_recent_history', res.data.data.diaries)
      console.log('getFullUserInfo():')
      console.log(res.data.data)
      if (callback && callback.success) {
        callback.success(res)
      }
    }
  })
}

module.exports = {

  sendLoginCode: loginCode => {
    doRequest('GET', 'get_openId_action', { js_code: loginCode }, {
      success: res => { 
        wx.setStorageSync('user_ids', res.data.data)
        console.log('sendLoginCode():')
        console.log(res.data.data)
        storeUserInfo()
        getFullUserInfo()
      }
    })
  },

  saveNewDiary: (callback) => {
    doRequest('POST', 'emotion', util.getStoredEditingDiary(), {
      success: res => {
        wx.setStorageSync('user_match', res.data.data.match)
        console.log('saveDiary():')
        console.log(res.data.data)
        getFullUserInfo(callback)
      }
    })
  },

  getFullDiary: (diaryId, callback) => {
    doRequest('GET', 'get_diary_action', {
      diaryId: diaryId
    }, {
      success: (res) => {
        console.log('getFullDiary():')
        console.log(res.data.data)
        if (callback && callback.success) {
          callback.success(res)
        }
      }
    })
  },

  saveEditedDiary: (diaryId, callback) => {
    var storedEditingDiary = util.getStoredEditingDiary()
    doRequest('POST', 'alt_diary_action', {
      diaryId: diaryId,
      title: storedEditingDiary.title,
      content: storedEditingDiary.diary
    }, {
      success: (res) => {
        console.log('saveEditedDiary():')
        console.log(res.data.data)
        getFullUserInfo(callback)
      }
    })
  }
}