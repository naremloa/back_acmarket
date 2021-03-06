import mongoose from 'mongoose';
import { Models } from '../../db';

const { Order } = Models;

const { ObjectId } = mongoose.Types;

const orderFind = async (query) => {
  const res = await Order.find(query).sort({ updateTime: -1 });
  return res;
}

const orderInsert = async (fObj) => {
  const res = await Order.create(fObj);
  return res;
}

const orderFindById = async (id) => {
  const res = await Order.findById(ObjectId(id));
  return res;
}

const orderFindByIdAndUpdate = async (id, updateObj) => {
  const res = await Order.findByIdAndUpdate(
    ObjectId(id),
    updateObj,
  );
  return res;
};

const orderFindByIdAndDelete = async(id) => {
  const res = await Order.findByIdAndDelete(id);
  return res;
}

export {
  orderFind,
  orderInsert,
  orderFindById,
  orderFindByIdAndUpdate,
  orderFindByIdAndDelete,
};