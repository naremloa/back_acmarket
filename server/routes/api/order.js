import { values, keys, forOwn } from 'lodash';
import mongoose from 'mongoose';
import {
  omitValueValid,
  formatDateQuery,
  chNumToDate,
  getDatePriceKey,
  dateTime,
} from '../utils/formatQuery';
import {
  orderFind,
  orderInsert,
  orderFindByIdAndUpdate,
  orderFindById,
  orderCountByCreateTime,
} from '../models/order';
import {
  getOccByDateAndRoomCidObj,
  addOcc,
  getRoomCidOccByDate,
} from './occ';
import {
  occDeleteManyByOrderCid,
} from '../models/occ';
import {
  getRoomAllMaxLengthAndPriceInfo,
} from './room';
import { outputSuccess, outputError } from '../utils/outputFormat';
import {
  orderCheckedStauts,
  dayMilli,
  depositPercent,
} from '../utils/constVar';

const { ObjectId } = mongoose.Types;

const getOrder = async (req, res) => {
  const {
    query: {
      orderId, name, phone, nationality, breakfast, status, createStartTime, createEndTime,
      outOfTimeSign = false, timeOutSign = false,
    },
  } = req;
  const nowTime = new Date().getTime();
  const outOfTimeNum = dayMilli * 2;
  const timeOutNum = dayMilli * 3;
  const query = formatDateQuery(
    ['create'],
    omitValueValid({
      orderId,
      name,
      phone,
      nationality,
      breakfast,
      status,
      createStartTime,
      createEndTime,
    }),
  );
  if (outOfTimeSign) {
    query.createTime = { $gte: nowTime - outOfTimeNum, $lt: nowTime - timeOutNum };
  }
  if (timeOutSign) {
    query.createTime = { $gte: nowTime - timeOutNum };
  }

  const order = await orderFind(query);
  const handleOutOfTimeAndTimeOutAboutOrder = order.map((i) => {
    const timeDiff = nowTime - i.createTime;
    return {
      ...i,
      outOfTimeSign: timeDiff >= outOfTimeNum && timeDiff < timeOutNum,
      timeOutSign: timeDiff >= timeOutNum,
    };
  });
  res.send(outputSuccess(handleOutOfTimeAndTimeOutAboutOrder));
};

const createOrderSchema = async ({
  name = '',
  phone = '',
  email = '',
  nationality = '',
  gender = '',
  breakfast = '',
  numberAdult = 0,
  numberChild = 0,
  demand = [],
  totalPrice = 0,
  account = '',
  arriveTime = '',
  note = '',
  roomInfoDate,
}, update = false) => {
  const nowTime = new Date().getTime();
  // update
  const maintPart = {
    name,
    phone,
    email,
    nationality,
    gender,
    breakfast,
    numberAdult: Number.isNaN(Number(numberAdult)) ? 0 : Number(numberAdult),
    numberChild: Number.isNaN(Number(numberChild)) ? 0 : Number(numberChild),
    demand: demand.join(),
    latestModifyAccount: account,
    lastestModifyTime: nowTime,
    arriveTime,
    note,
  };
  if (!update) return maintPart;
  // create
  const count = await orderCountByCreateTime();
  const orderId = Number(`${dateTime(nowTime)}${count.toString().padStart(2, '0')}`) + 1;
  const localRoomInfo = [];
  forOwn(roomInfoDate, (dateArr, roomCid) => localRoomInfo.push({
    roomCid: ObjectId(roomCid),
    num: dateArr.length,
  }));
  const totalDeposit = totalPrice * depositPercent || 0;
  return {
    ...maintPart,
    orderId,
    createTime: nowTime,
    roomInfo: localRoomInfo,
    totalDeposit,
    totalValidDeposit: 0,
    totalPrice,
    totalValidPrice: 0,
    totalRefund: 0,
    totalValidRefund: 0,
    status: 1,
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
      numberAdult,
      numberChild,
      note,
      demand,
      arriveTime,
      /**
       * roomInfo
       * [
       *    { date: 20190217, roomCid: '5c5ed89dd6b4f80dbe3c1281' },
       *    { date: 20190217, roomCid: '5c5ed89dd6b4f80dbe3c1281' },
       *    ...
       * ]
       */
      roomInfo,
    },
    session: sess,
  } = req;
  const account = /^\/front/.test(req.url)
    ? 'guestFromFront'
    : sess.userInfo && sess.userInfo.account;

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
    // 單一房型下最大房間數量和單價
    const { max, price } = roomAllInfo[keyRoomCid];
    // 遍歷當前訂單房型下的入住時間
    forOwn(valueRoomCid, (valueDate, keyDate) => {
      if (totalPrice === false) return;
      // 房間預定數量
      const num = valueDate;
      // 房間入住時間價格
      const subRoomPrice = price[getDatePriceKey(chNumToDate(keyDate))];

      // 當前房型無佔用, 或當前房型有佔用, 但佔用時間與遍歷時間不一樣, 即 佔用數為 0
      const occNum = roomAllInDateInfo[keyRoomCid] === undefined
        || roomAllInDateInfo[keyRoomCid][keyDate] === undefined
        ? 0 : roomAllInDateInfo[keyRoomCid][keyDate];
      if (occNum + num > max) {
        totalPrice = false;
        return;
      }
      totalPrice += (subRoomPrice * num);
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
    numberAdult,
    numberChild,
    demand,
    roomInfo,
    totalPrice,
    account,
    note,
    arriveTime,
    roomInfoDate,
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
      gender,
      breakfast,
      numberAdult,
      numberChild,
      demand,
      arriveTime,
      note,
    },
    session: sess,
  } = req;
  const { userInfo: { account } } = sess;
  const order = await orderFindById(cid);
  if (!order) return res.send(outputError('找不到相關訂單'));
  if (orderCheckedStauts.includes(order.status)) return res.send(outputError('此訂單已結單'));
  const updateObj = createOrderSchema({
    name,
    phone,
    email,
    nationality,
    gender,
    breakfast,
    numberAdult,
    numberChild,
    demand,
    account,
    arriveTime,
    note,
  }, true);
  await orderFindByIdAndUpdate(cid, updateObj);
  return res.send(outputSuccess({}, '更新成功'));
};

const checkedOrder = async (cid) => {
  const res = await occDeleteManyByOrderCid(cid);
};

/**
 * 訂單狀態更新規則:
 * 已下訂單 1: 已付訂金(2), 已退訂(6), 無效(8)
 * 動作: (1 -> 2)確認實收訂金,  (1 -> 6)計算應退金額,進入結單流程  (1 -> 8)進入結單流程
 *
 * 已付訂金 2: 已付尾款(3), 已退訂(6), 無效(8)
 * 動作: (2 -> 3)確認實收總價,  (2 -> 6)計算應退金額,進入結單流程  (2 -> 8)進入結單流程
 *
 * 已付尾款 3: 已入住(4), 已退訂(6), 無效(8)
 * 動作: (3 -> 6)計算應退金額,進入結單流程  (3 -> 8)進入結單流程
 *
 * 已入住 4: 結單(5), 已退訂(6), 無效(8)
 * 動作: (4 -> 5)進入結單流程,  (4 -> 6)計算應退金額,進入結單流程  (4 -> 8)進入結單流程
 *
 * 結單 5: 無效(8)
 * 動作: 已結單
 *
 * 已退訂 6: 退訂結單(7), 無效(8)
 * 動作: (6 -> 7)確認實退金額
 *
 * 退訂結單 7: 無效(8)
 * 動作: 已結單
 *
 * 無效 8:
 * 動作: 已結單
 */
const validStatusChange = {
  1: [2, 6, 8],
  2: [3, 6, 8],
  3: [4, 6, 8],
  4: [5, 6, 8],
  5: [8],
  6: [7, 8],
  7: [8],
  8: [],
};
const actionStatusChange = {
  2: ['confirmDeposit'],
  3: ['confirmPrice'],
  5: ['checkedOrder'],
  6: ['calRefund', 'checkedOrder'],
  7: ['confirmRefund'],
  8: ['checkedOrder'],
};

const verifyOrderStatusChange = (preStatus, afterStatus) => {
  const tmp = validStatusChange[preStatus];
  return tmp !== undefined && tmp.includes(Number(afterStatus));
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
