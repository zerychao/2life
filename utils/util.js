var baseData = require("../utils/base_data.js")

var getStoredOpenId = () => {
  return wx.getStorageSync('user_ids').openid
}

var getStoredUserInfo = () => {
  return wx.getStorageSync('user_userInfo')
}

var getStoredMatchUser = () => {
  var userMatch = wx.getStorageSync('user_match')
  if (userMatch && userMatch.user) {
    return userMatch.user
  } else {
    return {}
  }
}

var deepCopy = obj => {
  var newObj = {}
  newObj = JSON.parse(JSON.stringify(obj))
  return newObj
}

var parseWeekday = date => {
  var date_new = date.split(/-/);
  var year = parseInt(date_new[0]);
  var month = parseInt(date_new[1]);
  var day = parseInt(date_new[2]);
  if (month == 1 || month == 2) {
    month += 12;
    year -= 1;
  }
  var week = (day + 2 * month + 3 * (month + 1) / 5 + year + year / 4 - year / 100 + year / 400) % 7;
  week = parseInt(week);
  switch (week + 1) {
    case 1: return "Mon";
    case 2: return "Tue";
    case 3: return "Wed";
    case 4: return "Thu";
    case 5: return "Fri";
    case 6: return "Sat";
    case 7: return "Sun";
    default: return "error";
  }
}

module.exports = {

  getHttpFullUrl: path => {
    return baseData.baseUrl + baseData.httpRoot + path + '/';
  },

  getStoredOpenId: getStoredOpenId,

  getStoredUserInfo: getStoredUserInfo,

  storeUserIds: (userIds) => {
    wx.setStorageSync('user_ids', userIds)
  },

  storeUserInfo: (userInfo) => {
    wx.setStorageSync('user_userInfo', userInfo)
  },

  getStoredRecentHistory: () => {
    return wx.getStorageSync('user_recent_history')
  },

  storeRecentHistory: (diaries) => {
    wx.setStorageSync('user_recent_history', diaries)
  },

  getStoredAllHistory: () => {
    return wx.getStorageSync('user_all_history')
  },

  storeAllHistory: diaries => {
    wx.setStorageSync('user_all_history', diaries)
  },

  getStoredEditingDiary: () => {
    return {
      openId: getStoredOpenId(),
      // title: wx.getStorageSync('main_editing_diary_title'),
      title: getApp().globalData.editingDiary.title,
      // content: wx.getStorageSync('main_editing_diary_text')
      content: getApp().globalData.editingDiary.text
    }
  },

  getStoredEditingDiaryId: () => {
    // return wx.getStorageSync('main_editing_diary_id')
    return getApp().globalData.editingDiary.diaryId
  },

  getStoredEditingDiaryTitle: () => {
    // return wx.getStorageSync('main_editing_diary_title')
    return getApp().globalData.editingDiary.title
  },

  getStoredEditingDiaryText: () => {
    // return wx.getStorageSync('main_editing_diary_text')
    return getApp().globalData.editingDiary.text
  },

  storeEditingDiaryId: (id) => {
    // wx.setStorageSync('main_editing_diary_id', id)
    getApp().globalData.editingDiary.diaryId = id
  },

  storeEditingDiaryTitle: (title) => {
    // wx.setStorageSync('main_editing_diary_title', title)
    getApp().globalData.editingDiary.title = title
  },

  storeEditingDiaryText: (text) => {
    // wx.setStorageSync('main_editing_diary_text', text)
    getApp().globalData.editingDiary.text = text
  },

  getStoredMatch: () => {
    return wx.getStorageSync('user_match')
  },

  storeMatch: match => {
    wx.setStorageSync('user_match', match)
  },

  getStoredMatchUser: getStoredMatchUser,

  getStoredChatroomId: () => {
    return wx.getStorageSync('user_chatroom_id')
  },

  storeChatroomId: chatroomId => {
    wx.setStorageSync('user_chatroom_id', chatroomId)
  },

  getStoredChatHistory : () => {
    return wx.getStorageSync('user_chat_history')
  },

  storeChatHistory: (messages) => {
    wx.setStorageSync('user_chat_history', messages)
  },

  removeInvalidStorage: () => {
    // wx.removeStorageSync('main_editing_diary_id')
    // wx.removeStorageSync('main_editing_diary_title')
    // wx.removeStorageSync('main_editing_diary_text')
    getApp().globalData.editingDiary.diaryId = ''
    getApp().globalData.editingDiary.title = ''
    getApp().globalData.editingDiary.text = ''
  },

  formatTime: date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  },

  formatNumber: n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  parseDiaryData: {

    splitByDate: diaryList => {
      // 遍历对象计算共有多少相同的日期
      var n = 1;
      var publish_date = diaryList[0].publish_date;
      for (var l = 1; l < diaryList.length; l++) {
        if (publish_date != diaryList[l].publish_date) {
          publish_date = diaryList[l].publish_date;
          n++;
        }
      }
      //
      var arrtemp = deepCopy(diaryList);
      for (var j = 0; j < arrtemp.length; j++) {
        var date_new = arrtemp[j].publish_date.split(/-/);
        arrtemp[j].publish_date = date_new[2];
      }
      //
      var arr = new Array(n);
      for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array();
      }
      arr[0][0] = arrtemp[0];
      arr[0][0].weekday = parseWeekday(diaryList[0].publish_date);
      var count = 0;
      for (var i = 1, j = 1; i < diaryList.length; i++ , j++) {
        if (diaryList[i].publish_date == diaryList[i - 1].publish_date) {
          arr[count][j] = arrtemp[i];
          arr[count][j].weekday = parseWeekday(diaryList[i].publish_date);
        }
        else {
          count++;
          j = 0;
          arr[count][j] = arrtemp[i];
          arr[count][j].weekday = parseWeekday(diaryList[i].publish_date);
        }
      }
      return arr;
    },

    // 实现日期只有日和增加星期的方法
    dateToDayWeekday: diaryList => {
      var arr2 = deepCopy(diaryList);
      for (var j = 0; j < arr2.length; j++) {
        var date_new = arr2[j].publish_date.split(/-/);
        arr2[j].publish_date = date_new[2];
        arr2[j].weekday = parseWeekday(diaryList[j].publish_date);
      }
      return arr2;
    }

  },

  parseMessageData: (messageList) => {
    var newList = deepCopy(messageList)
    for (var i = 0; i < newList.length; i++) {
      var isItMe = messageList[i].openId == getStoredOpenId()
      newList[i].mesType = (isItMe ? 'myItem' : 'youItem')
      newList[i].mesitem = {
        userInfo: (isItMe ? getStoredUserInfo() : getStoredMatchUser()),
        mes: messageList[i].content
      }
    }
    return newList
  },

  showUI: {

    showDeleteConfirm: callback => {
      wx.showModal({
        title: 'Delete',
        content: 'Do you really want to delete this diary? It cannot be restored.',
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        success: callback.success,
        fail: callback.fail,
        complete: callback.complete
      })
    },

    showNullInputNotice: () => {
      wx.showModal({
        title: 'Save',
        content: 'It seems that you didn\'t enter anything.',
        showCancel: false,
        confirmText: 'OK'
      })
    },

    showPairDetailsMenu: callback => {
      wx.showActionSheet({
        itemList: ['Choose Picture', 'Unpair'],
        success: callback.success,
        fail: callback.fail,
        complete: callback.complete
      })
    }

  }

}
