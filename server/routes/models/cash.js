import mongoose from 'mongoose';
import { Models } from '../../db';

const { Cash } = Models;

const { ObjectId } = mongoose.Types;

const cashFind = async (query) => {
  const res = await Cash.find(query);
  return res;
};

const cashCount = async () => {
  const res = await Cash.estimatedDocumentCount();
  return res;
};

const cashInsert = async (cashObj) => {
  const res = await Cash.create(cashObj);
  return res;
};

const cashFindByIdAndUpdate = async (id, updateObj) => {
  const res = await Cash.findByIdAndUpdate(
    ObjectId(id),
    updateObj,
  );
  return res;
};

export {
  cashFind,
  cashCount,
  cashInsert,
  cashFindByIdAndUpdate,
};
