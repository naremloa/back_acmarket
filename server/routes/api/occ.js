import { values } from 'lodash';
import { outputSuccess, outputError } from '../utils/outputFormat';
import { dateTime } from '../utils/formatQuery';
import {
  occFind,
} from '../models/occ';
import {
  roomFind,
  roomFindById,
} from '../models/room';

const getOccList = async (req, res) => {
  const { startTime, endTime } = req;
  const startDate = dateTime(startTime);
  const endDate = dateTime(endTime);
  if (!startDate || !endDate) return res.send(outputError('查詢條件有誤'));
  const query = { date: { $gte: startDate, $lt: endDate } };
  const roomInfo = (await roomFind({}))
    .map(i => ({ _id: i._id, name: i.name, length: i.roomList.length }))
    .reduce((acc, cur) => ({ ...acc, [cur._id.toString()]: cur.length }), {});
  const occ = await occFind(query);
  const occInfo = occ.reduce((acc, cur) => {
    const { date, roomCid } = cur;
    const cid = roomCid.toString;
    if (acc[date] === undefined) return { ...acc, [date]: { [cid]: 0 } };
    const num = acc[date][cid] !== undefined ? acc[date][cid] + 1 : 0;
    return { ...acc, [date]: { [cid]: num } };
  }, {});
  const result = {
    occ: occInfo,
    info: roomInfo,
  };
  return res.send(outputSuccess(result, '查詢成功'));
};

const getOccByDateAndRoomCid = async ({ startDate, endDate, roomCid }) => {
  const query = {
    date: { $get: startDate, $lt: endDate },
    roomCid,
  };
  const room = await roomFindById(roomCid);
  if (!room) return false;
  const maxRoomLength = room.roomList.length;
  const occ = await occFind(query);
  if (occ && occ.length) {
    const occInfo = occ
      .reduce((acc, cur) => (acc[cur.date] === undefined
        ? { ...acc, [cur.date]: 0 }
        : { ...acc, [cur.date]: acc[cur.date] + 1 }));
    if (values(occInfo).find(v => v >= maxRoomLength) !== undefined) return false;
  }
  return true;
};

const addOcc = async ({ date, orderCid, rommCid }) => {

};

export {
  getOccList,
  getOccByDateAndRoomCid,
};
