// getTimeStamp(GMTTime: String): unixTimeStamp: Number
// 返回13位的时间戳(精确到毫秒)
// 格式为"2020-08-31T16:18:57"
const getTimeStamp = GMTTime => {
  const arr = GMTTime.split("T");
  const str = arr[0] + " " + arr[1];
  return new Date(str).getTime();
};

// getIntervalToCurrentTime(GivenTime: String): intervalTime: String
// 获取给定时间到现在的时间间隔
// 返回形式为 XX年XX月XX日XX:XX:XX
const getIntervalToCurrentTime = givenTime => {

  if (null == givenTime) return null;

  var givenTimeStamp = getTimeStamp(givenTime) / 1000;
  var currTimeStamp = parseInt(new Date().getTime() / 1000);
  var interval = currTimeStamp - givenTimeStamp;

  // 负值判断，增加通用性
  if (interval < 0) {
    interval = Math.abs(interval);
  }

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
    intervalTime = tmp + "小时";
  }
  else if (interval < 3600 * 24 * 30) {
    tmp = parseInt(interval / (3600 * 24));
    intervalTime = tmp + "天";
  }
  else if (interval < 3600 * 24 * 30 * 12) {
    tmp = parseInt(interval / (3600 * 24 * 30));
    intervalTime = tmp + "月";
  }
  else {
    tmp = parseInt(interval / (3600 * 24 * 30 * 12));
    intervalTime = tmp + "年";
  }
  return intervalTime;

};

// formatNumber(n: Number): nn: String
const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

// formatTime(date: Date): YYYY-MM-dd
const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return [year, month, day].map(formatNumber).join('-');
};

// getIntervalToCurrentWeek(Giventime: String): intervalWeek : number
// 获得给定时间的周数间隔（有余进一）
// 传入格式为 'yyyy-MM-dd'
const getIntervalToCurrentWeek = (givenTime, giveTime) => {
  if (null == givenTime) return null;
  let startTime = Date.parse(new Date(givenTime));
  var CurrentTime = Date.parse(giveTime);
  let intervalWeek = Math.ceil((CurrentTime - startTime) / 604800000);
  return intervalWeek;
}

// getTimeOfWeek(Giventime: String): intervalWeek :array
// 获得给定时间对应一周的日期和星期
// 返回格式 [{ year: yyyy, month: MM, day: dd, week: number }]
const getTimeOfWeek = givenTime => {
  if (null == givenTime) return null;
  let weekday
  let week = givenTime.getDay();
  let nowDate = Date.parse(givenTime);
  let newDate = 0,day = 0,year = 0,month = 0
  let intervalWeek = []
  if (week === 0) {week = 7}
  for (let i = 0; i < week - 1; i++) {
    newDate = nowDate - 86400000 * (week - 1 - i);
    newDate = new Date(newDate);
    day = newDate.getDate();
    year = newDate.getFullYear();
    month = newDate.getMonth() + 1;
    weekday = newDate.getDay();
    intervalWeek.push({
      year, month, day, week : weekday
    })
  }
  for (let i = week; i < 8; i++) {
    newDate = nowDate + 86400000 * (i - week);
    newDate = new Date(newDate);
    day = newDate.getDate();
    year = newDate.getFullYear();
    month = newDate.getMonth() + 1;
    weekday = newDate.getDay();
    intervalWeek.push({
      year, month, day, week : weekday
    })
  }
  return intervalWeek;
}

module.exports = {
  getTimeStamp,
  getIntervalToCurrentTime,
  formatTime,
  getIntervalToCurrentWeek,
  getTimeOfWeek
};
