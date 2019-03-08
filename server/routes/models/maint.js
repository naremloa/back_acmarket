import mongoose from 'mongoose';
import { Models } from '../../db';

const { Maint } = Models;

const { ObjectId } = mongoose.Types;

const maintFind = async (query) => {
  const res = await Maint.find(query).sort({ modifyTime: -1 }).lean();
  return res;
};

const maintInsert = async (maintObj) => {
  const res = await Maint.create(maintObj);
  return res;
};

const maintFindByIdAndUpdate = async (id, updateObj) => {
  const res = await Maint.findByIdAndUpdate(
    ObjectId(id),
    updateObj,
  );
  return res;
};

export {
  maintFind,
  maintInsert,
  maintFindByIdAndUpdate,
};
