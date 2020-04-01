import mongoose from 'mongoose';
import { Models } from '../../db';

const { Turnip } = Models;

const { ObjectId } = mongoose.Types;

const turnipFind = async (query) => {
  const res = await Turnip.find(query).sort({ price: -1 });
  return res;
}

const turnipInsert = async (fObj) => {
  const res = await Turnip.create(fObj);
  return res;
}

const turnipFindOne = async (query) => {
  const res = await Turnip.findOne(query).lean();
  return res;
}

const turnipFindById = async (id) => {
  const res = await Turnip.findById(ObjectId(id)).lean();
  return res;
}

const turnipFindByIdAndUpdate = async (id, updateObj) => {
  const res = await Turnip.findByIdAndUpdate(
    ObjectId(id),
    updateObj,
  );
  return res;
};

export {
  turnipFind,
  turnipFindOne,
  turnipInsert,
  turnipFindById,
  turnipFindByIdAndUpdate,
};