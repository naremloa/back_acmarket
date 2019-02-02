// import { pickBy } from 'lodash';
import { omitDateKey, formatDateKey } from '../utils/formatQuery';
import {
  orderFind,
  orderCount,
  orderInsert,
  orderFindByIdAndUpdate,
} from '../models/order';
import { outputSuccess } from '../utils/outputFormat';

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
  roomType,
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
    roomType,
    price,
    totalPrice,
    totalValidPrice: 0,
    status: 0,
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
      roomType,
      price,
      totalPrice,
      note,
    },
    session: sess,
  } = req;
  const { userInfo: { account } } = sess;
  const newOrder = await createOrderSchema({
    name,
    phone,
    email,
    nationality,
    checkInTime,
    checkOutTime,
    roomType,
    price,
    totalPrice,
    account,
    note,
  });
  await orderInsert(newOrder);
  // TODO:
  return res.send(outputSuccess({}, '老婆兒大人我愛你，不要氣噗噗了嘛好不好'));
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
      roomType,
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
    roomType,
    price,
    totalPrice,
    note,
    latestModifyAccount: account,
    lastestModifyTime: nowTime,
  };
  await orderFindByIdAndUpdate(cid, updateObj);
  return res.send(outputSuccess({}, '老婆兒老婆兒，啊啊啊啊，幸苦咧'));
};

export {
  getOrder,
  addOrder,
  updateOrder,
};
