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

module.exports = {

  sendLoginCode : loginCode => {
    doRequest('GET', 'get_openId_action', { js_code: loginCode }, {
      success: res => { 
        wx.setStorageSync('user_ids', res.data.data)
        storeUserInfo()
        console.log('sendLoginCode():')
        console.log(res.data.data)
      }
    })
  },
}