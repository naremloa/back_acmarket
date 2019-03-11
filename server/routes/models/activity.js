import mongoose from 'mongoose';
import { Models } from '../../db';

const { Activity } = Models;

const { ObjectId } = mongoose.Types;

const activityFind = async (query) => {
  const res = await Activity.find(query).sort({ modifyTime: -1 }).lean();
  return res;
};

const activityInsert = async (activityObj) => {
  const res = await Activity.create(activityObj);
  return res;
};

const activityFindById = async (cid) => {
  const res = await Activity.findById(ObjectId(cid)).lean();
  return res;
};

const activityFindByIdAndUpdate = async (cid, updateObj) => {
  const res = await Activity.findByIdAndUpdate(
    ObjectId(cid),
    updateObj,
  );
  return res;
};

const activityUpdateMany = async (query, doc) => {
  const res = await Activity.updateMany(query, doc);
  return res;
};

const activityFindOne = async (query) => {
  const res = await Activity.findOne(query).lean();
  return res;
};

export {
  activityFind,
  activityInsert,
  activityFindByIdAndUpdate,
  activityFindById,
  activityUpdateMany,
  activityFindOne,
};
