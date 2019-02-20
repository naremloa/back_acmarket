import { values, keys } from 'lodash';
import mongoose from 'mongoose';
import {
  omitDateKey,
  formatDateKey,
  dateTime,
  getDateRangeArr,
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
} from './occ';
import {
  getRoomAllMaxLengthAndPriceInfo,
} from './room';
import { outputSuccess, outputError } from '../utils/outputFormat';

const { ObjectId } = mongoose.Types;

const getOrder = async (req, res) => {
  const { query } = req;
  const dateCheck = ['checkOut', 'checkIn', 'create'];
  const localQuery = omitDateKey(dateCheck, query);
  const dateQuery = formatDateKey(dateCheck, query);

  const order = await orderFind({ ...localQuery, ...dateQuery });
  res.send(outputSuccess(order));
};

const createOrderSchema = async ({
  name,
  phone,
  email,
  nationality,
  checkInTime,
  checkOutTime,
  roomCidArr,
  roomInfo,
  totalPrice,
  account,
  note,
}) => {
  const nowTime = new Date().getTime();
  const count = await orderCount();
  const localRoomInfo = roomCidArr.map(i => ({
    roomCid: ObjectId(i),
    subRoomId: 0,
    price: roomInfo[i].price,
  }));
  return {
    orderId: count + 1,
    name,
    phone,
    email,
    nationality,
    checkInTime,
    checkOutTime,
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

const addOrder = async (req, res) => {
  const {
    body: {
      name,
      phone,
      email,
      nationality,
      checkInTime,
      checkOutTime,
      roomCidArr,
      note,
    },
    session: sess,
  } = req;
  const { userInfo: { account } } = sess;

  // 處理房型房間信息
  const roomMaxInfo = await getRoomAllMaxLengthAndPriceInfo();
  /**
   * {
   *    5c5ed89dd6b4f80dbe3c1281: {
   *      qty: 2,
   *      max: 5,
   *      price: 2000,
   *    }
   * }
   */
  const roomInfo = roomCidArr
    .reduce((acc, cur) => (acc[cur] !== undefined
      ? { ...acc, [cur]: { ...acc[cur], qty: acc[cur].qty + 1 } }
      : { ...acc, [cur]: { qty: 1, ...roomMaxInfo[cur] } }));
  const totalPrice = (new Set(roomCidArr)).reduce((acc, cur) => {
    if ((acc === false) || cur.qty > cur.max) return false;
    return acc + Number(cur.price);
  }, 0);
  if (totalPrice === false) return res.send(outputError('新增訂單異常，訂房數量超過最大房間數'));

  // 查詢occ表，查看訂單是否有效
  const validStatus = await getOccByDateAndRoomCidObj({
    startDate: dateTime(checkInTime),
    endDate: dateTime(checkOutTime),
    roomInfo,
  });
  if (!validStatus) return res.send(outputError('新增訂單異常，occ查詢不過'));

  const newOrderObj = await createOrderSchema({
    name,
    phone,
    email,
    nationality,
    checkInTime,
    checkOutTime,
    roomCidArr,
    roomInfo,
    totalPrice,
    account,
    note,
  });
  const newOrder = await orderInsert(newOrderObj);
  console.log('newOrder', newOrder);
  // TODO: 新增訂單同時，塞進occ表中佔位
  const dateArr = getDateRangeArr(checkInTime, checkOutTime);
  await addOcc({ dateArr, orderCid: newOrder._id, roomCidArr });
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
