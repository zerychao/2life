var baseData = require("../utils/base_data.js")

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
  switch(week+1){
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

  parseDiaryData: {

    splitByDate: diaryList => {
      // 遍历对象计算共有多少相同的日期
      var n = 1;
      var date = diaryList[0].date;
      for (var l = 1; l < diaryList.length; l++) {
        if (date != diaryList[l].date) {
          date = diaryList[l].date;
          n++;
        }
      }
      //
      var arrtemp = deepCopy(diaryList);
      for (var j = 0; j < arrtemp.length; j++) {
        var date_new = arrtemp[j].date.split(/-/);
        arrtemp[j].date = date_new[2];
      }
      //
      var arr = new Array(n);
      for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array();
      }
      arr[0][0] = arrtemp[0];
      arr[0][0].weekday = parseWeekday(diaryList[0].date);
      var count = 0;
      for (var i = 1, j = 1; i < diaryList.length; i++ , j++) {
        if (diaryList[i].date == diaryList[i - 1].date) {
          arr[count][j] = arrtemp[i];
          arr[count][j].weekday = parseWeekday(diaryList[i].date);
        }
        else {
          count++;
          j = 0;
          arr[count][j] = arrtemp[i];
          arr[count][j].weekday = parseWeekday(diaryList[i].date);
        }
      }
      return arr;
    },

    // 实现日期只有日和增加星期的方法
    dateToDayWeekday: diaryList => {
      var arr2 = deepCopy(diaryList);
      for (var j = 0; j < arr2.length; j++) {
        var date_new = arr2[j].date.split(/-/);
        arr2[j].date = date_new[2];
        arr2[j].weekday = parseWeekday(diaryList[j].date);
      }
      return arr2;
    }

  }

}
