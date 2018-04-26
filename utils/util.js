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
      var arrtemp = new Array();
      arrtemp = JSON.parse(JSON.stringify(diaryList));
      for (var j = 0; j < arrtemp.length; j++) {
        var date_new = arrtemp[j].date.split(/-/);
        arrtemp[j].date = date_new[2];
      }
      //
      var arr = new Array(n);
      for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array();
      }
      arr[0][0]=arrtemp[0];
      var count = 0;
      for (var i = 1, j = 1; i < diaryList.length; i++ , j++) {
        if (diaryList[i].date == diaryList[i - 1].date) {
          arr[count][j]=arrtemp[i];
        }
        else {
          count++;
          j = 0;
          arr[count][j]=arrtemp[i];
        }
      }
      return arr;
    },

    // 实现日期只有日和星期的方法
    dateToDayWeekday: diaryList => {
      var arr2 = new Array();
      arr2=JSON.parse(JSON.stringify(diaryList));
      for(var j=0;j<arr2.length;j++){
        var date_new = arr2[j].date.split(/-/);
        arr2[j].date = date_new[2];
      }
      return arr2;
    }

  }
  
}
