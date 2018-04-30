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
        getFullUserInfo()
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
      wx.setStorageSync('user_userInfo', res.data.data.user)
      wx.setStorageSync('user_recent_history', res.data.data.diaries)
      wx.setStorageSync('user_match', res.data.data.match)
      console.log('getFullUserInfo():')
      console.log(res.data.data)
      if (res.data.data.match) {
        getChatroomId({})
      }
      if (callback && callback.success) {
        callback.success(res)
      }
    }
  })
}

var getChatroomId = callback => {
  doRequest('GET', 'get_pair_action', {
    openId: util.getStoredOpenId()
  }, {
      success: res => {
        wx.setStorageSync('user_chatroom_id', res.data.data.pair_id)
        console.log('getChatroomId():')
        console.log(res.data.data)
        if (callback && callback.success) {
          callback.success(res)
        }
        getChatHistory(res.data.data.pair_id, callback)
      }
    })
}

var getChatHistory = (pair_id, callback) => {
  doRequest('GET', 'get_history_action', { 
    pair_id: pair_id 
  }, {
    success: res => {
      wx.setStorageSync('user_chat_history', res.data.data.messages)
      console.log('getChatHistory():')
      console.log(res.data.data)
      if (callback && callback.success) {
        callback.success(res)
      }
    }
  })
}

module.exports = {

  sendLoginCode: loginCode => {
    doRequest('GET', 'get_openId_action', { 
      js_code: loginCode 
    }, {
      success: res => { 
        wx.setStorageSync('user_ids', res.data.data)
        console.log('sendLoginCode():')
        console.log(res.data.data)
        storeUserInfo()
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
      content: storedEditingDiary.content
    }, {
      success: (res) => {
        console.log('saveEditedDiary():')
        console.log(res.data.data)
        getFullUserInfo(callback)
      }
    })
  },

  deleteDiary: (diaryId, callback) => {
    doRequest('POST', 'delete_diary_action', {
      diaryId: diaryId
    }, {
      success: (res) => {
        console.log('deleteDiary():')
        console.log(res.data)
        getFullUserInfo(callback)
      }
    })
  },

  getAllHistory: () => {
    doRequest('GET', 'get_user_diary_action', {
      openId: util.getStoredOpenId()
    }, {
      success: (res) => {
        wx.setStorageSync('user_all_history', res.data.data.diaries)
        console.log('getAllHistory():')
        console.log(res.data.data)
      }
    })
  },

  unpair: callback => {
    doRequest('GET', 'depair_action', {
      openId: util.getStoredOpenId()
    }, {
      success: res => {
        wx.setStorageSync('user_match', '')
        console.log('unpair():')
        console.log(res.data)
        callback.success(res)
      }
    })
  }

}