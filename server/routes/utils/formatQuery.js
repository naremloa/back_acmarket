import {
  has, omit, omitBy, isNumber,
} from 'lodash';
import {
  dayMilli,
} from './constVar';

export const omitDateKey = (dateKeyArr, data) => {
  const localDateKeyArr = dateKeyArr.map(i => [`${i}TimeStart`, `${i}TimeEnd`]);
  const omitArr = [];
  // const checkStatus = true;
  localDateKeyArr.forEach((checkKey) => {
    if (has(data, checkKey[0])) omitArr.push(checkKey[0]);
    if (has(data, checkKey[1])) omitArr.push(checkKey[1]);
  });
  return omit(data, omitArr);
};

export const formatDateKey = (dateKeyArr, data) => {
  const localDateKeyArr = dateKeyArr.map(i => [`${i}TimeStart`, `${i}TimeEnd`]);
  const formatObj = {};
  localDateKeyArr.forEach((checkKey, checkIndex) => {
    const tmp = `${dateKeyArr[checkIndex]}Time`;
    if (has(data, checkKey[0])) {
      formatObj[tmp] = { ...formatObj[tmp], $gte: Number(data[checkKey[0]]) };
    }
    if (has(data, checkKey[1])) {
      formatObj[tmp] = { ...formatObj[tmp], $lte: Number(data[checkKey[1]]) };
    }
  });
  return formatObj;
};

export const formatDateQuery = (dateKeyArr, data) => {
  const localQuery = omitDateKey(dateKeyArr, data);
  const dateQuery = formatDateKey(dateKeyArr, data);
  return { ...localQuery, ...dateQuery };
};

export const omitValueValid = obj => omitBy(obj, val => val === undefined);

const timeToDate = (v, number = false) => {
  const date = new Date(Number(v));
  const deconstruction = {
    Y: date.getFullYear(),
    M: (date.getMonth() + 1).toString().padStart(2, '0'),
    D: date.getDate().toString().padStart(2, '0'),
    h: date.getHours().toString().padStart(2, '0'),
    m: date.getMinutes().toString().padStart(2, '0'),
    s: date.getSeconds().toString().padStart(2, '0'),
    day: Number(date.getDay()) || 7,
  };
  const result = ['Y', 'M', 'D', 'h', 'm', 's', 'day']
    .reduce((acc, cur) => ({
      ...acc,
      [cur]: number
        ? Number(deconstruction[cur])
        : deconstruction[cur],
    }), {});
  return {
    date,
    ...result,
  };
};

export const chNumToDate = (num) => {
  if (num) {
    return `${num}`.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
  }
  return false;
};

export const dateTime = (time, all = false) => {
  if (time) {
    const {
      Y, M, D, h, m, s,
    } = timeToDate(time);
    if (all) return Number(`${Y}${M}${D}${h}${m}${s}`);
    return Number(`${Y}${M}${D}`);
  }
  return false;
};

export const getDatePriceKey = (date) => {
  if (date) {
    const localDate = isNumber(date) ? chNumToDate(date) : date;
    const { M, day } = timeToDate(localDate, true);
    const frontKey = (M >= 4 && M <= 10) ? 'peakSeason' : 'lowSeason';
    const backKey = (day >= 1 && day <= 5) ? 'Weekday' : 'Weekend';
    return `${frontKey}${backKey}`;
  }
  return false;
};

export const getDateRangeArr = (startTime, endTime) => {
  if (startTime && endTime) {
    const localStartTime = Number(startTime);
    const localEndTime = Number(endTime);
    const arr = [];
    for (let i = localStartTime; i <= localEndTime; i += 86400000) {
      arr.push(dateTime(i));
    }
    return arr;
  }
  return false;
};

export const datePlus = (dateNum, num = 1) => {
  const time = (new Date(chNumToDate(dateNum))).setHours(0, 0, 0, 0);
  return dateTime(time + (num * dayMilli));
};

export const dateMinus = (dateNum, num = 1) => {
  const time = (new Date(chNumToDate(dateNum))).setHours(0, 0, 0, 0);
  return dateTime(time - (num * dayMilli));
};

export const getDateDiff = (a, b) => {
  const aTime = (new Date(chNumToDate(a))).setHours(0, 0, 0, 0);
  const bTime = (new Date(chNumToDate(b))).setHours(0, 0, 0, 0);
  const diff = (Math.abs(aTime - bTime)) / dayMilli;
  return Number.isNaN(diff) ? false : diff;
};
