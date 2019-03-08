import { outputSuccess, outputError } from '../utils/outputFormat';
import {
  activityFind,
  activityInsert,
} from '../models/activity';
import { dateTime } from '../utils/formatQuery';

const getActivity = async (req, res) => {
  const activity = await activityFind({});
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
    session: { userInfo: account },
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
  const activityObj = createActivitySchema({
    name, roomActivityPrice, mag, activityPrice, remainDay, startDate, endDate, code,
  });
  const newActivity = await activityInsert(activityObj);
  return res(outputSuccess({}, '新增成功'));
};

export {
  getActivity,
  addActivity,
};
