import mongoose from 'mongoose';
import { Models } from '../../db';
import { dateTime, chNumToDate } from '../utils/formatQuery';

const { Order } = Models;

const { ObjectId } = mongoose.Types;

const orderFind = async (query) => {
  const res = await Order.find(query).sort({ createTime: -1 }).lean();
  return res;
};

const orderCount = async () => {
  const res = await Order.estimatedDocumentCount();
  return res;
};

const orderCountByCreateTime = async (createTime) => {
  const today = new Date(chNumToDate(dateTime(createTime))).getTime();
  const tomorrow = new Date(chNumToDate(dateTime(createTime + 86400000))).getTime();
  const query = { createTime: { $gte: today, $lt: tomorrow } };
  const res = await Order.countDocuments(query).lean();
  return res;
};

const orderInsert = async (orderObj) => {
  const res = await Order.create(orderObj);
  return res;
};

const orderFindById = async (id) => {
  const res = await Order.findById(ObjectId(id));
  return res;
};

const orderFindByIdAndUpdate = async (id, updateObj) => {
  const res = await Order.findByIdAndUpdate(
    ObjectId(id),
    updateObj,
  );
  return res;
};

export {
  orderFind,
  orderCount,
  orderInsert,
  orderFindByIdAndUpdate,
  orderFindById,
  orderCountByCreateTime,
};
