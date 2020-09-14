// 格式为"2020-08-31T16:18:57"
// 返回13位的时间戳(精确到毫秒)
var getTimeStamp = function (GMTTime) {
  var arr = GMTTime.split("T");
  var str = arr[0] + " " + arr[1];
  return new Date(str).getTime();
}

// 获取给定时间到现在的时间间隔
// 返回形式为 XX年XX月XX日XX:XX:XX
var getIntervalToCurrentTime = function (GivenTime) {
  if (null == GivenTime) {
    return null;
  }
  var givenTimeStamp = getTimeStamp(GivenTime) / 1000;
  var currTimeStamp = parseInt(new Date().getTime() / 1000);
  var interval = currTimeStamp - givenTimeStamp;
  // 解决时区问题
  interval -= 8 * 3600;
  var intervalTime;
  var tmp;
  if (interval < 60) {
    intervalTime = "1分钟";
  }
  else if (interval < 3600) {
    tmp = parseInt(interval / 60);
    intervalTime = tmp + "分钟";
  }
  else if (interval < 3600 * 24) {
    tmp = parseInt(interval / 3600);
    intervalTime = tmp + "小时"
  }
  else if (interval < 3600 * 24 * 30) {
    tmp = parseInt(interval / (3600 * 24));
    intervalTime = tmp + "天";
  }
  else if (interval < 3600 * 24 * 30 * 365) {
    tmp = parseInt(interval / (3600 * 24 * 30));
    intervalTime = tmp + "月";
  }
  else {
    tmp = parseInt(interval / (3600 * 24 * 30 * 365));
    intervalTime = tmp + "年";
  }
  return intervalTime
}

// 在XXX.js通过 var util = require("../../utils/utils.js")和
// util.XXX()来引用
module.exports = {
  getTimeStamp: getTimeStamp,
  getIntervalToCurrentTime: getIntervalToCurrentTime
}