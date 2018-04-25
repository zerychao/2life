var baseData = require("../utils/base_data.js")

module.exports = {

  getFullUrl: path => {
    return baseData.baseUrl + path;
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

  parseDiarydate: diaryList => {
    // 遍历对象计算共有多少相同的日期
    var n = 1;
    var date = diaryList[0].date;
    for (var l = 1; l < diaryList.length; l++) {
      if (date != diaryList[l].date) {
        date = diaryList[l].date;
        n++;
      }
    }
    var arr = new Array(n);
    for (var i = 0; i < arr.length; i++) {
      arr[i] = new Array();
    }
    arr[0][0] = diaryList[0];
    var count = 0;
    for (var i = 1, j = 1; i < diaryList.length; i++ , j++) {
      if (diaryList[j].date == diaryList[j - 1].date) {
        arr[count][j] = diaryList[i];
      }
      else {
        count++;
        j = 0;
        arr[count][j] = diaryList[i];
      }
    }
    return arr;
  }
  
}
