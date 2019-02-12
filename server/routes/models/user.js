import mongoose from 'mongoose';
import { Models } from '../../db';
import { omitValueValid } from '../utils/formatQuery';

const { User } = Models;

const { ObjectId } = mongoose.Types;

const userFindById = async (id) => {
  const res = await User.findById(ObjectId(id));
  return res;
};

const userFind = async (query) => {
  const localQuery = omitValueValid(query);
  const res = await User.find(localQuery).populate('role');
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
