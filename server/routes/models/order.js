import mongoose from 'mongoose';
import { Models } from '../../db';

const { Order } = Models;

const { ObjectId } = mongoose.Types;

const orderFind = async (query) => {
  const res = await Order.find(query);
  return res;
};

const orderCount = async () => {
  const res = await Order.estimatedDocumentCount();
  return res;
};

const orderInsert = async (orderObj) => {
  const res = await Order.create(orderObj);
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
};
