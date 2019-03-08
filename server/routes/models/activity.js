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

const activityFindByIdAndUpdate = async (cid, updateObj) => {
  const res = await Activity.findByIdAndUpdate(
    ObjectId(cid),
    updateObj,
  );
  return res;
};


export {
  activityFind,
  activityInsert,
  activityFindByIdAndUpdate,
};
