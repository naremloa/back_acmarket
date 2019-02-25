import mongoose from 'mongoose';
import { values, keys } from 'lodash';
import { outputSuccess, outputError } from '../utils/outputFormat';
import { dateTime, getDateRangeArr } from '../utils/formatQuery';
import {
  occFind,
  occInsertMany,
} from '../models/occ';
import {
  roomFind,
} from '../models/room';

const { ObjectId } = mongoose.Types;

const getOccList = async (req, res) => {
  const { name: cid } = req.params;
  const query = {
    orderCid: ObjectId(cid),
  };
  const occList = await occFind(query);
  const roomAll = (await roomFind({})).reduce((acc, { _id, name }) => ({
    ...acc, [_id.toString()]: name,
  }));
  const result = occList
    .map(({ date, roomCid }) => ({ date, roomName: roomAll[roomCid.toString()] }));
  return res.send(outputSuccess(result));
};

// 前台，查詢佔用obj
const getOcc = async (req, res) => {
  const { query: { startTime, endTime } } = req;
  const startDate = dateTime(startTime);
  const endDate = dateTime(endTime);
  if (!startDate || !endDate) return res.send(outputError('查詢條件有誤'));
  const query = { date: { $gte: startDate, $lt: endDate } };
  const roomInfo = (await roomFind({}))
    .map(({
      _id, name, price, roomList,
    }) => ({
      _id, name, price, length: roomList.length,
    }))
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
    occ: completeOccInfo,
    info: roomInfo,
  };
  return res.send(outputSuccess(result, '查詢成功'));
};

/**
 * roomCidObj
 * {
 *    5c5ed89dd6b4f80dbe3c1281: {
 *      qty: 2,
 *      max: 5,
 *      price: 2000,
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
const getRoomCidOccByDate = async (roomInfoDate) => {
  const arr = values(roomInfoDate).reduce((acc, cur) => [...acc, ...cur], []);
  const query = { date: { $in: arr } };
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
  const localRoomInfo = roomInfo.map(({ date, roomCid }) => ({
    date,
    roomCid: ObjectId(roomCid),
    orderCid,
  }));
  const result = await occInsertMany(localRoomInfo);
  return true;
};

export {
  getOcc,
  getOccByDateAndRoomCidObj,
  addOcc,
  getRoomCidOccByDate,
  getOccList,
};
