import mongoose from 'mongoose';
import { isArray } from 'lodash';
import {
  outputSuccess,
  outputError,
} from '../utils/outputFormat';
import {
  orderFind,
  orderInsert,
  orderFindById,
  orderFindByIdAndUpdate,
} from '../models/order';

const { ObjectId } = mongoose.Types;

const getOrderSelf = async (req, res) => {
  const { query, session: sess } = req;
  const userName = sess.userInfo && sess.userInfo.account;
  if (!userName) return res.send(outputError('無效操作用戶'));
  const data = await orderFind(query);
  if (isArray(data) && data.length > 0) {
    return res.send(outputSuccess(data));
  }
  return res.send(outputSuccess([]));
}

const getOrderOther = async (req, res) => {
  const { query: { createUser }, session: sess } = req;
  const userName = sess.userInfo && sess.userInfo.account;
  if (!userName) return res.send(outputError('無效操作用戶'));
  const data = await orderFind({ createUser: { $ne: createUser }, status: { $ne: 4 } });
  if (isArray(data) && data.length > 0) {
    return res.send(outputSuccess(data));
  }
  return res.send(outputSuccess([]));
}

const createOrderSchema = ({
  fId, name, userName
}) => {
  const nowTime = new Date().getTime();
  return {
    fId: ObjectId(fId),
    name,
    createUser: userName,
    targetUser: '',
    createTime: nowTime,
    updateTime: nowTime,
    status: 0,
  };
};

const addOrder = async (req, res) => {
  const {
    body: {
      id: fId,
      name,
    },
    session: sess,
  } = req;
  const userName = sess.userInfo && sess.userInfo.account;
  if (!userName) return res.send(outputError('無效操作用戶'));
  const newOrder = createOrderSchema({
    fId, name, userName,
  })
  await orderInsert(newOrder);
  return res.send(outputSuccess({}, '創建成功'));
}

const changeStatusOrder = async (req, res) => {
  const {
    body: {
      id,
      status,
    },
    session: sess,
  } = req;
  const userName = sess.userInfo && sess.userInfo.account;
  if (!userName) return res.send(outputError('無效操作用戶'));
  const item = await orderFindById(id);
  if (!item) return res.send(outputError('無效操作id'));
  if (item.status + 1 !== status) return res.send(outputError('無效操作'));
  item.status = status
  await orderFindByIdAndUpdate(id, item);
  return res.send(outputSuccess({}, '更新成功'));
}

export {
  getOrderSelf,
  addOrder,
  changeStatusOrder,
  getOrderOther,
};