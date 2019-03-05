import mongoose from 'mongoose';
import { Models } from '../../db';

const { Occ } = Models;

const { ObjectId } = mongoose.Types;

const occFind = async (query) => {
  const res = await Occ.find(query).lean();
  return res;
};

const occInsertMany = async (arr) => {
  const res = await Occ.insertMany(arr);
  return res;
};

const occFindById = async (id) => {
  const res = await Occ.findById(ObjectId(id));
  return res;
};

const occFindByIdAndUpdate = async (cid, updateObj) => {
  const res = await Occ.findByIdAndUpdate(ObjectId(cid), updateObj);
  return res;
};

const occDeleteManyByOrderCid = async (orderCid) => {
  const res = await Occ.deleteMany({ orderCid: ObjectId(orderCid) });
  return res;
};

export {
  occFind,
  occInsertMany,
  occFindById,
  occFindByIdAndUpdate,
  occDeleteManyByOrderCid,
};
