import {
  values, keys, forOwn, isObject,
} from 'lodash';
import mongoose from 'mongoose';
import {
  omitValueValid,
  formatDateQuery,
  getDatePriceKey,
  dateTime,
  dateMinus,
} from '../utils/formatQuery';
import {
  orderFind,
  orderInsert,
  orderFindByIdAndUpdate,
  orderFindById,
  orderCountByCreateTime,
} from '../models/order';
import {
  addOcc,
  getRoomCidOccByDate,
} from './occ';
import {
  occDeleteManyByOrderCid,
} from '../models/occ';
import {
  getRoomAllMaxLengthAndPriceInfo,
} from './room';
import {
  activityFindValid,
  getActivityRoomPriceByDay,
} from './activity';
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
  roomInfoCount,
  roomAllInfo,
  activity = null,
}, update = false) => {
  const nowTime = new Date().getTime();
  // update
  const mainPart = {
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
  if (update) return mainPart;
  // create
  const count = await orderCountByCreateTime(nowTime);
  const orderId = Number(`${dateTime(nowTime)}${count.toString().padStart(3, '0')}`) + 1;
  const totalDeposit = totalPrice * depositPercent || 0;
  const localRoomInfo = {};
  forOwn(roomInfoCount, (dateObj, roomCid) => {
    const { name: roomName, price } = roomAllInfo[roomCid];
    forOwn(dateObj, ({ num, index = 1 }, date) => {
      const roomPrice = price[getDatePriceKey(date)];
      const totalRoomPrice = activity
        ? getActivityRoomPriceByDay({ ...activity, price: roomPrice }, index)
        : roomPrice;
      localRoomInfo[date] = [
        ...(localRoomInfo[date] || []),
        {
          roomName, totalRoomPrice, roomCount: num, subTotal: num * totalRoomPrice,
        },
      ];
    });
  });
  return {
    ...mainPart,
    orderId,
    createTime: nowTime,
    totalDeposit,
    totalValidDeposit: 0,
    totalPrice,
    totalValidPrice: 0,
    totalRefund: 0,
    totalValidRefund: 0,
    status: 1,
    roomInfo: localRoomInfo,
  };
};

/**
 * 通過roomInfo，解析 roomInfoCount
 * roomInfoCount
 * {
 *    5c5ed89dd6b4f80dbe3c1281: {
 *      20190217: {
 *        num: 2
 *        index: 1 (with activity)
 *      },
 *      20190218: {
 *        num: 1
 *        index: 2 (with activity)
 *      },
 *    }
 * }
 */
const getCountByRoomInfo = (roomInfo, activity = false) => {
  const tmp = roomInfo
    .reduce((acc, { date, roomCid }) => ({
      ...acc,
      [roomCid]: !isObject(acc[roomCid])
        ? { [date]: { num: 1 } }
        : {
          ...acc[roomCid],
          [date]: {
            num: (acc[roomCid][date] || { num: 0 }).num + 1,
          },
        },
    }), {});
  if (!activity) return tmp;
  let valid = true;
  forOwn(tmp, (valueRoomObj) => {
    if (!valid) return;
    const dateArr = keys(valueRoomObj).sort();
    dateArr.forEach((date) => {
      if (!valid) return;
      const ytd = dateMinus(date);
      if (valueRoomObj[ytd] !== undefined) {
        if (valueRoomObj[ytd].num < valueRoomObj[date].num) valid = false;
        else valueRoomObj[date].index = valueRoomObj[ytd].index + 1;
      } else valueRoomObj[date].index = 1;
    });
  });
  if (!valid) return false;
  return tmp;
};

// 測試用
const orderTest = async (req, res) => {
  const {
    body: { roomInfo },
  } = req;
  const activity = await activityFindValid();
  const roomInfoCount = getCountByRoomInfo(roomInfo, !!activity);

  let totalPrice = 0;
  forOwn(roomInfoCount, (valueRoomCid, keyRoomCid) => {
    if (totalPrice === false) return;
    // 單一房型下最大房間數量和單價
    const price = 2660;
    // 遍歷當前訂單房型下的入住時間
    forOwn(valueRoomCid, ({ num, index = 1 }, keyDate) => {
      if (totalPrice === false) return;
      // 房間入住時間價格
      const subRoomPrice = price;
      const totalSubRoomPrice = activity
        ? getActivityRoomPriceByDay({ ...activity, price: subRoomPrice }, index)
        : subRoomPrice;

      totalPrice += (totalSubRoomPrice * num);
      console.log('check', totalSubRoomPrice, keyDate, keyRoomCid);
    });
  });
  return res.send(outputSuccess(totalPrice));
};

const checkOrder = async (req, res) => {
  const { query: { roomInfo }, session: sess } = req;
  const activity = await activityFindValid();
  const roomInfoCount = getCountByRoomInfo(roomInfo, !!activity);
  if (!!activity && !roomInfoCount) {
    return res.send(outputError('檢測到該訂單訂房組合較為複雜，請電聯民宿協助訂房'));
  }
  const roomAllInfo = await getRoomAllMaxLengthAndPriceInfo();

  const localRoomInfo = {};
  forOwn(roomInfoCount, (dateObj, roomCid) => {
    const { name: roomName, price } = roomAllInfo[roomCid];
    forOwn(dateObj, ({ num, index = 1 }, date) => {
      const roomPrice = price[getDatePriceKey(date)];
      const totalRoomPrice = activity
        ? getActivityRoomPriceByDay({ ...activity, price: roomPrice }, index)
        : roomPrice;
      localRoomInfo[date] = [
        ...(localRoomInfo[date] || []),
        {
          roomName, totalRoomPrice, roomCount: num, subTotal: num * totalRoomPrice,
        },
      ];
    });
  });
  return res.send(outputSuccess(localRoomInfo, '查詢成功'));
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

  const activity = await activityFindValid();

  // 處理房型房間信息
  const roomAllInfo = await getRoomAllMaxLengthAndPriceInfo();
  const roomAllCid = keys(roomAllInfo);
  if (roomInfo.find(i => !(roomAllCid.includes(i.roomCid)))) {
    return res.send(outputError('訂單中存在未知房型，生成訂單失敗'));
  }

  const roomInfoCount = getCountByRoomInfo(roomInfo, !!activity);
  if (!!activity && !roomInfoCount) {
    return res.send(outputError('檢測到該訂單訂房組合較為複雜，請電聯民宿協助訂房'));
  }

  const roomAllInDateInfo = await getRoomCidOccByDate(roomInfoCount);


  // 借totalPrice判斷，若為false則房間訂單不合法，若為數字，則房間訂單成立，並同時給出應計總價
  let totalPrice = true;
  // 遍歷所有訂單房型
  forOwn(roomInfoCount, (valueRoomCid, keyRoomCid) => {
    if (totalPrice === false) return;
    // 單一房型下最大房間數量和單價
    const { max, price } = roomAllInfo[keyRoomCid];
    // 遍歷當前訂單房型下的入住時間
    forOwn(valueRoomCid, ({ num, index = 1 }, keyDate) => {
      if (totalPrice === false) return;
      // 房間入住時間價格
      const subRoomPrice = price[getDatePriceKey(keyDate)];
      const totalSubRoomPrice = activity
        ? getActivityRoomPriceByDay({ ...activity, price: subRoomPrice }, index)
        : subRoomPrice;

      // 當前房型無佔用, 或當前房型有佔用, 但佔用時間與遍歷時間不一樣, 即 佔用數為 0
      const occNum = roomAllInDateInfo[keyRoomCid] === undefined
        || roomAllInDateInfo[keyRoomCid][keyDate] === undefined
        ? 0 : roomAllInDateInfo[keyRoomCid][keyDate];
      if (occNum + num > max) {
        totalPrice = false;
        return;
      }
      totalPrice += (totalSubRoomPrice * num);
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
    totalPrice,
    account,
    note,
    arriveTime,
    roomInfoCount,
    roomAllInfo,
    activity,
  });
  const newOrder = await orderInsert(newOrderObj);
  console.log('newOrder', newOrder);

  await addOcc(
    roomInfo.map(({ date, roomCid }) => {
      const { price } = roomAllInfo[roomCid];
      return { date, roomCid, price: price[getDatePriceKey(date)] };
    }),
    newOrder._id,
  ); return res.send(outputSuccess({}, '新增訂單'));
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
  const updateObj = await createOrderSchema({
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
      status: afterStatus,
    },
    session: sess,
  } = req;
  const targetOrder = await orderFindById(cid);
  if (!targetOrder) return res.send(outputError('更新帳單異常'));
  const { status } = targetOrder;
  // 判斷是否符合狀態更新規則
  if (!verifyOrderStatusChange(targetOrder.status, afterStatus)) return res.send(outputError('更新狀態值異常'));
  // 執行更新狀態後必要操作

  const { userInfo: { account } } = sess;
  const nowTime = new Date().getTime();
  const updateObj = {
    afterStatus,
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
  orderTest,
  checkOrder,
};
