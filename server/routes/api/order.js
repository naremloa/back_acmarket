// import { pickBy } from 'lodash';
import { omitDateKey, formatDateKey } from '../utils/formatQuery';
import {
  orderFind,
  orderCount,
  orderInsert,
  orderFindByIdAndUpdate,
  orderFindById,
} from '../models/order';
import { outputSuccess, outputError } from '../utils/outputFormat';

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
  roomCid,
  price,
  totalPrice,
  account,
  note,
}) => {
  const nowTime = new Date().getTime();
  const count = await orderCount();
  return {
    orderId: count + 1,
    name,
    phone,
    email,
    nationality,
    checkInTime,
    checkOutTime,
    createTime: nowTime,
    roomCid,
    price,
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
      roomCid,
      price,
      totalPrice,
      note,
    },
    session: sess,
  } = req;
  const { userInfo: { account } } = sess;

  // 查詢occ表，查看訂單是否有效

  const newOrder = await createOrderSchema({
    name,
    phone,
    email,
    nationality,
    checkInTime,
    checkOutTime,
    roomCid,
    price,
    totalPrice,
    account,
    note,
  });
  await orderInsert(newOrder);
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
