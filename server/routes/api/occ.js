import mongoose from 'mongoose';
import {
  values, keys, has, isArray,
} from 'lodash';
import { outputSuccess, outputError, formatTryCatch } from '../utils/outputFormat';
import {
  dateTime, getDateRangeArr, omitValueValid, formatDateQuery,
} from '../utils/formatQuery';
import {
  occFind,
  occFindById,
  occInsertMany,
  occFindByIdAndUpdate,
} from '../models/occ';
import {
  roomFind,
  roomFindById,
} from '../models/room';
import {
  getSubRoomAboutAll,
} from './room';
import {
  activityFindValid,
  getActivityRoomPriceByDay,
} from './activity';
import {
  orderFindById,
} from '../models/order';

const { ObjectId } = mongoose.Types;

const getOccList = async (req, res) => {
  const {
    query: {
      dateStartTime, dateEndTime, roomCid,
    },
  } = req;
  const query = formatDateQuery(
    ['date'],
    omitValueValid({ dateStartTime, dateEndTime, roomCid }),
  );
  const subRoomAll = (await getSubRoomAboutAll())
    .reduce((acc, {
      subCid, subName, cid, name,
    }) => ({
      ...acc,
      [cid]: {
        name,
        child: {
          ...(acc[cid] !== undefined ? acc[cid].child : {}),
          [subCid]: subName,
        },
      },
    }), {});
  const occ = (await occFind(query)).map(i => ({
    ...i,
    subRoomCid: i.subRoomCid ? i.subRoomCid : '',
    roomName: subRoomAll[i.roomCid].name,
    subRoomName: i.subRoomCid ? subRoomAll[i.roomCid].child[i.subRoomCid] : '',
  }));
  res.send(outputSuccess(occ));
};

const getOccDetailList = async (req, res) => {
  const { 0: cid } = req.params;
  const query = {
    orderCid: ObjectId(cid),
  };
  const occList = await occFind(query);
  const roomAll = (await roomFind({})).reduce((acc, { _id, name }) => ({
    ...acc, [_id.toString()]: name,
  }), {});
  const result = occList
    .map(({ date, roomCid }) => ({ date, roomName: roomAll[roomCid.toString() || roomCid] }));
  return res.send(outputSuccess(result));
};

const checkTimeSearch = async (startTime, endTime) => {
  if (!startTime || !endTime) throw new Error('開始或結束時間不能為空');
  const startDate = dateTime(startTime);
  const endDate = dateTime(endTime);
  if (startDate < dateTime(new Date().getTime())) throw new Error('開始日期不能小於當前日期');
  if (startDate > endDate) throw new Error('開始日期不能大於結束日期');
  if (endTime - startTime > 86400000 * 30) throw new Error('搜索間隔不能大於30天');
  return { startDate, endDate };
};

// 前台，查詢佔用obj
const getOcc = async (req, res) => {
  const { query: { startTime, endTime, join } } = req;
  const [err, data] = await formatTryCatch(checkTimeSearch(startTime, endTime));
  if (err) return res.send(outputError(err.message));
  const { startDate, endDate } = data;

  if (!startDate || !endDate) return res.send(outputError('查詢條件有誤'));

  const activity = await activityFindValid();

  const query = { date: { $gte: startDate, $lt: endDate } };

  const roomInfo = (await roomFind({}))
    .map(({
      _id, name, price, roomList,
    }) => {
      const tmp = {
        _id, name, price, length: roomList.length,
      };
      if (!activity) return tmp;
      const keyArr = keys(price);
      const activityPrice = keyArr.reduce((acc, cur) => ({
        ...acc,
        [cur]: getActivityRoomPriceByDay({ ...activity, price: price[cur] }, 1, !!join),
      }), {});
      return { ...tmp, price: activityPrice };
    })
    .reduce((acc, {
      _id, name, price, length,
    }) => ({ ...acc, [_id.toString()]: { name, price, length } }), {});
  const roomInfoKey = keys(roomInfo);
  const occ = await occFind(query);
  const occInfo = occ.reduce((acc, cur) => {
    const { date, roomCid } = cur;
    const cid = roomCid.toString();
    if (acc[date] === undefined) return { ...acc, [date]: { [cid]: 1 } };
    const num = acc[date][cid] !== undefined ? acc[date][cid] + 1 : 1;
    return { ...acc, [date]: { ...acc[date], [cid]: num } };
  }, {});
  const completeOccInfo = getDateRangeArr(startTime, endTime).reduce((acc, cur) => ({
    ...acc,
    [cur]: roomInfoKey.reduce((roomAcc, roomCur) => ({
      ...roomAcc,
      [roomCur]: (occInfo[cur] === undefined || occInfo[cur][roomCur] === undefined)
        ? 0 : occInfo[cur][roomCur],
    }), {}),
  }), {});
  const result = {
    activity: activity
      ? {
        label: activity.label,
        name: activity.name,
        startTime: activity.startDate,
        endTime: activity.endDate,
      }
      : undefined,
    occ: completeOccInfo,
    info: roomInfo,
  };
  return res.send(outputSuccess(omitValueValid(result), '查詢成功'));
};

/**
 * roomCidObj
 * {
 *    5c5ed89dd6b4f80dbe3c1281: {
 *      qty: 2,
 *      max: 5,
 *      price: {
 *        lowSeasonWeekday: 2000,
 *        lowSeasonWeekend: 2000,
 *        peakSeasonWeekday: 2000,
 *        peakSeasonWeekend: 2000,
 *      },
 *    }
 *    ...
 * }
 */
const getOccByDateAndRoomCidObj = async ({ startDate, endDate, roomCidObj }) => {
  if (!startDate || !endDate) return false;
  const roomCidArr = keys(roomCidObj);
  if (!roomCidArr.length) return false;
  const query = {
    date: { $get: startDate, $lt: endDate },
    roomCid: { $in: roomCidArr },
  };
  const occ = await occFind(query);
  if (!occ) return false;
  if (occ.length) {
    const occInfo = occ
      .reduce((acc, cur) => {
        const key = cur.roomCid.toString();
        if (acc[key] !== undefined) {
          const lastNum = Number.isNaN(Number(acc[key][cur.date])) ? 0 : Number(acc[key][cur.date]);
          return {
            ...acc,
            [key]: {
              ...acc[key],
              [cur.date]: lastNum + 1,
            },
          };
        }
        return { ...acc, [key]: { [cur.date]: 1 } };
      }, {});

    let status = true;
    roomCidArr.forEach((i) => {
      if (!status) return;
      const occArr = values(occInfo[i]);
      const occNum = roomCidObj[i].max - roomCidObj[i].qty;
      if (occArr.find(v => v > occNum) !== undefined) {
        status = false;
      }
    });
    if (!status) return false;
  }
  return true;
};

/**
 * 根據roomInfoDate 來獲取這些時間點下，所有房型的佔用數
 * @param {*} roomInfoDate 根據roomInfo 轉換出來的，每個房型下訂的時間點
 */
const getRoomCidOccByDate = async (roomInfoCount) => {
  const arr = keys(roomInfoCount)
    .reduce((acc, cur) => [...acc, ...keys(roomInfoCount[cur])], []);
  const query = { date: { $in: [...(new Set(arr))] } };
  const occ = await occFind(query);
  const result = occ.reduce((acc, { date, roomCid }) => {
    const localRoomCid = roomCid.toString();
    if (acc[localRoomCid] === undefined) acc[localRoomCid] = {};
    if (acc[localRoomCid][date] === undefined) acc[localRoomCid][date] = 0;
    acc[localRoomCid][date] += 1;
    return acc;
  }, {});
  return result;
};

const addOcc = async (roomInfo, orderCid) => {
  const localRoomInfo = roomInfo.map(({ date, roomCid, price }) => ({
    date,
    roomCid: ObjectId(roomCid),
    orderCid,
    price,
  }));
  const result = await occInsertMany(localRoomInfo);
  return true;
};

const getRestSubRoomArr = async ({ date, roomCid }) => {
  const room = await roomFindById(roomCid.toString());
  const allSubRoomArr = isArray(room && room.roomList)
    ? room.roomList.map(({ _id, name }) => ({ cid: _id.toString(), name })) : [];
  const queryOccArr = { date, roomCid };
  const occArrTmp = (await occFind(queryOccArr))
    .map(i => i.subRoomCid && i.subRoomCid.toString())
    .filter(i => i !== undefined);
  const occArr = [...(new Set(occArrTmp))];
  const restSubRoom = allSubRoomArr.filter(i => !occArr.includes(i.cid));
  return restSubRoom;
};

const getOccRoomOption = async (req, res) => {
  const { query: { cid } } = req;
  const occ = await occFindById(cid);
  if (!occ) return res.send(outputError('查詢不到訂單'));
  const { roomCid, date } = occ;
  const result = await getRestSubRoomArr({ date, roomCid });
  return res.send(outputSuccess(result));
};

const updateOccSubRoomCid = async (req, res) => {
  const {
    body: { cid, subRoomCid = '' },
  } = req;
  const occ = await occFindById(cid);
  if (!occ) return res.send(outputError('查詢不到訂單'));
  const { roomCid, date } = occ;
  const restSubRoomArr = (await getRestSubRoomArr({ date, roomCid })).map(i => i.cid);
  console.log('check', restSubRoomArr, subRoomCid);
  if (subRoomCid !== '' && !restSubRoomArr.includes(subRoomCid)) {
    return res.send(outputError('不能分配該房間'));
  }
  const updateObj = {
    subRoomCid: subRoomCid === '' ? null : ObjectId(subRoomCid),
  };
  await occFindByIdAndUpdate(cid, updateObj);
  return res.send(outputSuccess({}, '更新成功'));
};

const getOccOrderInfo = async (req, res) => {
  const { query: { occCid, orderCid } } = req;
  const occ = await occFindById(occCid);
  if (!occ) return res.send(outputError('查詢occ有誤'));
  if (occ.orderCid.toString() !== orderCid) return res.send(outputError('查詢訂單cid與occ不符'));
  const order = await orderFindById(orderCid);
  if (!order) return res.send(outputError('查詢訂單有誤'));
  return res.send(outputSuccess(order, '查詢成功'));
};

export {
  getOcc,
  getOccByDateAndRoomCidObj,
  addOcc,
  getRoomCidOccByDate,
  getOccDetailList,
  getOccList,
  updateOccSubRoomCid,
  getOccRoomOption,
  getOccOrderInfo,
};
