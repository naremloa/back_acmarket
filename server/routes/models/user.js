import mongoose from 'mongoose';
import { Models } from '../../db';

const { User } = Models;

const { ObjectId } = mongoose.Types;

const userFindById = async (id) => {
  const res = await User.findById(ObjectId(id));
  return res;
};

const userFind = async (query) => {
  const res = await User.find(query).populate('role');
  return res;
};

const userFindByIdAndUpdate = async (id, update) => {
  const res = await User.findByIdAndUpdate(ObjectId(id), update);
  return res;
};

export {
  userFindById,
  userFind,
  userFindByIdAndUpdate,
};
