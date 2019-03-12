import { omit } from 'lodash';
import { outputSuccess, outputError } from '../utils/outputFormat';
import {
  activityFind,
  activityInsert,
  activityFindByIdAndUpdate,
  activityFindById,
  activityUpdateMany,
  activityFindOne,
} from '../models/activity';
import { dateTime, chNumToDate } from '../utils/formatQuery';

const getActivity = async (req, res) => {
  const activity = (await activityFind({})).map(i => ({
    ...(omit(i, ['startDate', 'endDate'])),
    startTime: (new Date(chNumToDate(i.startDate))).getTime(),
    endTime: (new Date(chNumToDate(i.endDate))).getTime(),
  }));
  return res.send(outputSuccess(activity));
};

const createActivitySchema = async ({
  name,
  startDate,
  endDate,
  roomActivityPrice = 0,
  mag = 0,
  activityPrice = 0,
  remainDay = 0,
  code,
  account = '',
}, update = false) => {
  const nowTime = new Date().getTime();
  const mainPart = {
    name,
    startDate,
    endDate,
    roomActivityPrice,
    mag,
    activityPrice,
    remainDay,
    modifyTIme: nowTime,
    modifyAcount: account,
  };
  if (update) return mainPart;
  const createTime = nowTime;
  const createAccount = account;
  const status = 2;
  return {
    ...mainPart,
    code,
    status,
    createTime,
    createAccount,
  };
};

const addActivity = async (req, res) => {
  const {
    body: {
      name,
      startTime,
      endTime,
      roomActivityPrice,
      mag,
      activityPrice,
      remainDay,
    },
    session: { userInfo: { account } },
  } = req;
  const startDate = dateTime(startTime);
  const endDate = dateTime(endTime);
  const code = name;
  const existActivity = await activityFind({
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: endDate } },
      { startDate: { $lte: startDate }, endDate: { $gte: startDate } },
    ],
  });
  if (existActivity.length > 0) return res.send(outputError('新增活動的活動時間不合法'));
  const activityObj = await createActivitySchema({
    name, roomActivityPrice, mag, activityPrice, remainDay, startDate, endDate, code, account,
  });
  console.log('check', activityObj);
  const newActivity = await activityInsert(activityObj);
  return res.send(outputSuccess({}, '新增成功'));
};

const modifyActivity = async (req, res) => {
  const {
    body: {
      cid, name, startTime, endTime, roomActivityPrice, mag, activityPrice, remainDay,
    },
    session: { userInfo: { account } },
  } = req;
  const startDate = dateTime(startTime);
  const endDate = dateTime(endTime);
  const code = name;
  const updateObj = await createActivitySchema({
    name, roomActivityPrice, mag, activityPrice, remainDay, startDate, endDate, code, account,
  }, true);
  console.log(updateObj);
  const result = await activityFindByIdAndUpdate(cid, updateObj);
  if (!result) return res.send(outputError('修改異常'));
  return res.send(outputSuccess({}, '修改成功'));
};

// {roomActivityPrice: 380, mag: 2, activityPrice: 380, remainDay: 2, price: 2660}
const getActivityRoomPriceByDay = ({
  roomActivityPrice: r, mag: m, activityPrice: a, remainDay, price: p,
}, day, activity = true) => {
  if (remainDay < day) return p;
  return p + (r * m / (2 ** (day - 1))) + (activity ? a : 0);
};

const getActivityTotalPrice = ({
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

const toggleActivity = async (req, res) => {
  const { body: { cid, status } } = req;
  if (![0, 1].includes(Number(status))) return res.send(outputError('切換狀態值不合法'));
  // 停用
  if (Number(status) === 0) {
    const updateObj = { status: 2 };
    await activityFindByIdAndUpdate(cid, updateObj);
    return res.send(outputSuccess({}, '停用成功'));
  }
  // 啟用
  const activity = await activityFindById(cid);
  if (!activity) return res.send(outputError('找不到指定優惠活動'));
  if (activity.endDate < dateTime(new Date().getTime())) {
    return res.send(outputError('請調整活動結束時間'));
  }
  await activityUpdateMany({ status: 1 }, { status: 2 });
  const updateObj = { status: 1 };
  await activityFindByIdAndUpdate(cid, updateObj);
  return res.send(outputSuccess({}, '啟用成功'));
};

const activityFindValid = async () => {
  const nowDate = dateTime((new Date()).getTime());
  const res = await activityFindOne({
    status: 1,
    startDate: { $lte: nowDate },
    endDate: { $gte: nowDate },
  });
  return res;
};

export {
  getActivity,
  addActivity,
  getActivityRoomPriceByDay,
  getActivityTotalPrice,
  toggleActivity,
  activityFindValid,
  modifyActivity,
};
