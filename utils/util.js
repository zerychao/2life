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

  getFullUrl: path => {
    return baseData.baseUrl + path + '/';
  },

  getStoredOpenId: getStoredOpenId,

  getStoredUserInfo: key => {
    return wx.getStorageSync('user_userInfo')[key]
  },

  getStoredUserInfo: getStoredUserInfo,

  getStoredRecentHistory: () => {
    return wx.getStorageSync('user_recent_history')
  },

  getStoredAllHistory: () => {
    return wx.getStorageSync('user_all_history')
  },

  getStoredEditingDiary: () => {
    return {
      openId: getStoredOpenId(),
      title: wx.getStorageSync('main_editing_diary_title'),
      content: wx.getStorageSync('main_editing_diary_text')
    }
  },

  getStoredMatch: () => {
    return wx.getStorageSync('user_match')
  },

  getStoredMatchUser: getStoredMatchUser,

  getStoredChatHistory : () => {
    return wx.getStorageSync('user_chat_history')
  },

  removeInvalidStorage: () => {
    wx.removeStorageSync('main_editing_diary_id')
    wx.removeStorageSync('main_editing_diary_title')
    wx.removeStorageSync('main_editing_diary_text')
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
      return arr.reverse();
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
