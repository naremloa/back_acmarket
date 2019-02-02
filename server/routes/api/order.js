// import { pickBy } from 'lodash';
import { omitDateKey, formatDateKey } from '../utils/formatQuery';
import {
  orderFind,
  orderCount,
  orderInsert,
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
    sess,
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

export {
  getOrder,
  addOrder,
};
