var util = require("../utils/util.js")

var userInfo = app.globalData.userInfo

module.exports = {

  requestTest: callback => {
    wx.request({
      url: '',
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: callback.success,
      fail: callback.fail,
      complete: callback.complete,
    })
  },

  storeUserInfo: callback => {
    wx.request({
      url: util.getFullUrl('store'),
      data: userInfo,
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: callback.success,
      fail: callback.fail,
      complete: callback.complete,
    })
  }

}