import constList from '@/utils/const';

export const getDate = (timeType, type = 'fullDate') => {
  const dayList = ['日', '一', '二', '三', '四', '五', '六'];
  let timestamp = Date.now();
  if (typeof timeType === 'string' || typeof timeType === 'number') {
    const numberTime = new Date(timeType).setHours(0, 0, 0, 0);
    if (Number.isNaN(numberTime)) return '--';
    timestamp = numberTime;
  }

  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const date = d.getDate().toString().padStart(2, '0');
  const day = dayList[d.getDay()];
  if (type === 'fullDate') return `${year}-${month}-${date}`;
  if (type === 'fullDateFormat') return `${year}/${month}/${date}`;
  if (type === 'date') return `${month}/${date}`;
  if (type === 'M') return Number(month);
  if (type === 'day') return `${day}`;
  if (type === 'dayIndex') return d.getDay();
  if (type === 'timestamp') return timestamp;
  return '--';
};

export const getDatePriceKey = (date) => {
  if (date) {
    const M = getDate(date, 'M');
    const day = getDate(date, 'dayIndex');
    const frontKey = (M >= 4 && M <= 10) ? 'peakSeason' : 'lowSeason';
    const backKey = (day >= 1 && day <= 5) ? 'Weekday' : 'Weekend';
    return `${frontKey}${backKey}`;
  }
  return false;
};

export const formatNumberDate = (numberDate) => {
  const stringDate = numberDate.toString();
  const year = stringDate.slice(0, 4);
  const month = stringDate.slice(4, 6);
  const date = stringDate.slice(6, 8);

  return `${year}/${month}/${date}`;
};

export const formatOrderStatus = statusId => constList.orderStatusList
  .find(item => item.id === statusId).value;

// {roomActivityPrice: 380, mag: 2, activityPrice: 380, remainDay: 2, price: 2660}
export const getActivityRoomPriceByDay = ({
  roomActivityPrice: r, mag: m, activityPrice: a, remainDay, price: p,
}, day, activity = true) => {
  if (remainDay < day) return p;
  return p + (r * m / (2 ** (day - 1))) + (activity ? a : 0);
};

export const getActivityTotalPrice = ({
  roomActivityPrice: r, mag: m, activityPrice: a, remainDay, price: p,
}, totalDay, activity = true) => {
  const cal = (localDay) => {
    const tmp = (localDay * p) + (r * m * ((2 ** localDay) - 1) / (2 ** (localDay - 1)));
    if (activity) return tmp + (localDay * a);
    return tmp;
  };
  if (totalDay <= remainDay) {
    return cal(totalDay);
  }
  return cal(remainDay) + (totalDay - remainDay) * p;
};
