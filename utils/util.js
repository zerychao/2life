const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const parseDiaryData = (diaryList) => {
  var arr = new Array(6);   //表格有10行  
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array();    //每行有10列  
  }
  arr[0][0] = diaryList[0];
  var count = 0;
  for (var i = 1, j = 1; i < diaryList.length; i++ , j++) {
    if (diaryList[j].data == diaryList[j - 1].data) {
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

module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  parseDiaryData: parseDiaryData
}
