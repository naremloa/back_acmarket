import { values, keys, forOwn } from 'lodash';
import mongoose from 'mongoose';
import {
  omitValueValid,
  formatDateQuery,
} from '../utils/formatQuery';
import {
  orderFind,
  orderCount,
  orderInsert,
  orderFindByIdAndUpdate,
  orderFindById,
} from '../models/order';
import {
  getOccByDateAndRoomCidObj,
  addOcc,
  getRoomCidOccByDate,
} from './occ';
import {
  getRoomAllMaxLengthAndPriceInfo,
} from './room';
import { outputSuccess, outputError } from '../utils/outputFormat';

const { ObjectId } = mongoose.Types;

const getOrder = async (req, res) => {
  const {
    query: {
      orderId, name, phone, nationality, breakfast, status, createStartTime, createEndTime,
    },
  } = req;
  const query = formatDateQuery(
    ['create'],
    omitValueValid({
      orderId, name, phone, nationality, breakfast, status, createStartTime, createEndTime,
    }),
  );

  const order = await orderFind(query);
  res.send(outputSuccess(order));
};

const createOrderSchema = async ({
  name = '',
  phone = '',
  email = '',
  nationality = '',
  gender = '',
  breakfast = '',
  number = '',
  demand = [],
  totalPrice = 0,
  account = '',
  note = '',
  roomInfoDate,
  roomAllInfo,
}) => {
  const nowTime = new Date().getTime();
  const count = await orderCount();
  const localRoomInfo = [];
  forOwn(roomInfoDate, (dateArr, roomCid) => localRoomInfo.push({
    roomCid: ObjectId(roomCid),
    price: roomAllInfo[roomCid].price,
    num: dateArr.length,
  }));
  return {
    orderId: count + 1,
    name,
    phone,
    email,
    nationality,
    gender,
    breakfast,
    number,
    demand,
    createTime: nowTime,
    roomInfo: localRoomInfo,
    totalPrice,
    totalValidPrice: 0,
    status: 1,
    latestModifyAccount: account,
    lastestModifyTime: nowTime,
    note,
  };
};

const getDateAndCountByRoomInfo = (roomInfo) => {
  /**
   * 通過roomInfo，轉換成兩種格式
   * roomInfoDate
   * {
   *    5c5ed89dd6b4f80dbe3c1281: [20190217, 20190218],
   *    ...
   * }
   *
   * roomInfoCount
   * {
   *    5c5ed89dd6b4f80dbe3c1281: {
   *      20190217: 2,
   *      20190218: 1,
   *    }
   * }
   */
  const init = { roomInfoDate: {}, roomInfoCount: {} };
  const result = roomInfo.reduce(({ roomInfoDate, roomInfoCount }, { date, roomCid }) => {
    // handle Date change
    const localDate = roomInfoDate;
    localDate[roomCid] = [...(new Set([...(localDate[roomCid] || []), date]))];
    // handle Count Change
    const localCount = roomInfoCount;
    if (localCount[roomCid] === undefined) localCount[roomCid] = {};
    if (localCount[roomCid][date] === undefined) localCount[roomCid][date] = 0;
    localCount[roomCid][date] += 1;

    return { roomInfoDate: localDate, roomInfoCount: localCount };
  }, init);
  return result;
};

const addOrder = async (req, res) => {
  const {
    body: {
      name,
      phone,
      email,
      nationality,
      gender,
      breakfast,
      number,
      demand,
      /**
       * roomInfo
       * [
       *    { date: 20190217, roomCid: '5c5ed89dd6b4f80dbe3c1281' },
       *    { date: 20190217, roomCid: '5c5ed89dd6b4f80dbe3c1281' },
       *    ...
       * ]
       */
      roomInfo,
      note,
    },
    session: sess,
  } = req;
  const { userInfo: { account } } = sess;

  // 處理房型房間信息
  const roomAllInfo = await getRoomAllMaxLengthAndPriceInfo();
  const roomAllCid = keys(roomAllInfo);
  if (roomInfo.find(i => !(roomAllCid.includes(i.roomCid)))) {
    return res.send(outputError('訂單中存在未知房型，生成訂單失敗'));
  }

  const { roomInfoDate, roomInfoCount } = getDateAndCountByRoomInfo(roomInfo);

  const roomAllInDateInfo = await getRoomCidOccByDate(roomInfoDate);

  // 借totalPrice判斷，若為false則房間訂單不合法，若為數字，則房間訂單成立，並同時給出應計總價
  let totalPrice = true;
  // 遍歷所有訂單房型
  forOwn(roomInfoCount, (valueRoomCid, keyRoomCid) => {
    if (totalPrice === false) return;
    // 單一房型下最大房間數量
    const { max, price } = roomAllInfo[keyRoomCid];
    // 遍歷當前訂單房型下的入住時間
    forOwn(valueRoomCid, (valueDate, keyDate) => {
      if (totalPrice === false) return;
      // 房間預定數量
      const num = valueDate;

      // 當前房型無佔用, 或當前房型有佔用, 但佔用時間與遍歷時間不一樣, 即 佔用數為 0
      const occNum = roomAllInDateInfo[keyRoomCid] === undefined
        || roomAllInDateInfo[keyRoomCid][keyDate] === undefined
        ? 0 : roomAllInDateInfo[keyRoomCid][keyDate];
      if (occNum + num > max) {
        totalPrice = false;
        return;
      }
      totalPrice += (price * num);
    });
  });
  if (totalPrice === false) return res.send(outputError('新增訂單異常，occ查詢不過'));

  const newOrderObj = await createOrderSchema({
    name,
    phone,
    email,
    nationality,
    gender,
    breakfast,
    number,
    demand,
    roomInfo,
    totalPrice,
    account,
    note,
    roomInfoDate,
    roomAllInfo,
  });
  const newOrder = await orderInsert(newOrderObj);
  console.log('newOrder', newOrder);
  // TODO: 新增訂單同時，塞進occ表中佔位

  await addOcc(roomInfo, newOrder._id);
  // TODO:
  return res.send(outputSuccess({}, '新增訂單'));
};

const updateOrder = async (req, res) => {
  const {
    body: {
      cid,
      name,
      phone,
      email,
      nationality,
      checkInTime,
      checkOutTime,
      roomCid,
      price,
      totalPrice,
      note,
    },
    session: sess,
  } = req;
  const { userInfo: { account } } = sess;
  const nowTime = new Date().getTime();
  const updateObj = {
    name,
    phone,
    email,
    nationality,
    checkInTime,
    checkOutTime,
    roomCid,
    price,
    totalPrice,
    note,
    latestModifyAccount: account,
    lastestModifyTime: nowTime,
  };
  await orderFindByIdAndUpdate(cid, updateObj);
  return res.send(outputSuccess({}, '更新成功'));
};

/**
 * 訂單狀態更新有規則
 * 已下訂單 1: 已付款(2), 已取消(5)
 * 已付款 2: 已入住(3), 已取消(5)
 * 已入住 3: 已退房(4)
 * 已退房 4:
 */
const validStatusChange = {
  1: [2, 5],
  2: [3, 5],
  3: [4],
};

const verifyOrderStatusChange = (preStatus, afterStatus) => {
  const tmp = validStatusChange[preStatus];
  return tmp === undefined || tmp.includes(afterStatus);
};

const updateOrderStatus = async (req, res) => {
  const {
    body: {
      cid,
      status,
    },
    session: sess,
  } = req;
  const targetOrder = await orderFindById(cid);
  if (!targetOrder) return res.send(outputError('更新帳單異常'));
  if (!verifyOrderStatusChange(targetOrder.status, status)) return res.send(outputError('更新狀態值異常'));

  const { userInfo: { account } } = sess;
  const nowTime = new Date().getTime();
  const updateObj = {
    status,
    latestModifyAccount: account,
    lastestModifyTime: nowTime,
  };
  await orderFindByIdAndUpdate(cid, updateObj);
  return res.send(outputSuccess({}, '更新成功'));
};

export {
  getOrder,
  addOrder,
  updateOrder,
  updateOrderStatus,
};
