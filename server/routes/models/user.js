import mongoose from 'mongoose';
import { Models } from '../../db';

const { User } = Models;

const { ObjectId } = mongoose.Types;

const userFindById = async (id) => {
  const res = User.findById(ObjectId(id));
  return res;
};

const userFind = async (query) => {
  const res = User.find(query);
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
