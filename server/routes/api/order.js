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
  orderFindByIdAndDelete,
} from '../models/order';
import {
  furnitureFindById,
  furnitureFindByIdAndUpdate,
} from '../models/furniture';

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
  const data = await orderFind({
    createUser: { $ne: createUser },
    status: { $ne: 4 },
    $or: [
      { targetUser: '' },
      { targetUser: userName },
    ],
  });
  if (isArray(data) && data.length > 0) {
    return res.send(outputSuccess(data));
  }
  return res.send(outputSuccess([]));
}

const createOrderSchema = ({
  fId, name, userName
}) => {
  const nowTime = new Date(new Date().toLocaleString()).getTime();
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
    body: { id, status },
    session: sess,
  } = req;
  const userName = sess.userInfo && sess.userInfo.account;
  if (!userName) return res.send(outputError('無效操作用戶'));
  const item = await orderFindById(id);
  if (!item) return res.send(outputError('無效操作id'));
  if (item.targetUser !== ''
    && ![item.targetUser, item.createUser].includes(userName)) return res.send(outputError('已被其他用戶佔用'))
  if (![1, -1].includes(item.status - status)) return res.send(outputError('無效操作'));
  item.status = status
  // 已下訂狀態，只有創建訂單一方
  if (status === 0) item.targetUser = '';
  // 佔位狀態，建立訂單雙方
  if (status === 1) item.targetUser = userName;
  const nowTime = new Date(new Date().toLocaleString()).getTime();
  item.updateTime = nowTime;
  await orderFindByIdAndUpdate(id, item);
  if (status === 4) {
    const fItem = await furnitureFindById(item.fId);
    if (fItem) {
      [item.createUser, userName].forEach(i => {
        if (!fItem.owner.includes(i)) fItem.owner.push(i);
      })
    }
    await furnitureFindByIdAndUpdate(item.fId, fItem);
  }
  const result = await orderFindById(id);
  return res.send(outputSuccess(result, '更新成功'));
}

const delOrder = async (req, res) => {
  const { body: { id }, session: sess } = req;
  const userName = sess.userInfo && sess.userInfo.account;
  if (!userName) return res.send(outputError('無效操作用戶'));
  const item = await orderFindById(id);
  if (!item) return res.send(outputError('無效操作id'));
  await orderFindByIdAndDelete(id);
  return res.send(outputSuccess({}, '刪除成功'));
}

export {
  getOrderSelf,
  addOrder,
  changeStatusOrder,
  getOrderOther,
  delOrder,
};