import { has, omit, omitBy } from 'lodash';

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

export const omitValueValid = obj => omitBy(obj, val => val === undefined);

const timeToDate = (v, number = false) => {
  const date = new Date(Number(v));
  const Y = date.getFullYear();
  const M = (date.getMonth() + 1).toString().padStart(2, '0');
  const D = date.getDate().toString().padStart(2, '0');
  return {
    date,
    Y: number ? Number(Y) : Y,
    M: number ? Number(M) : M,
    D: number ? Number(D) : D,
  };
};

export const dateTime = (v) => {
  if (v) {
    const { Y, M, D } = timeToDate(v);
    return Number(`${Y}${M}${D}`);
  }
  return false;
};

export const getDateRangeArr = (startTime, endTime) => {
  if (startTime && endTime) {
    const arr = [];
    for (let i = startTime; i <= endTime; i += 86400000) {
      arr.push(dateTime(i));
    }
    return arr;
  }
  return false;
};
