import mongoose from 'mongoose';
import { Models } from '../../db';

const { Role } = Models;

const { ObjectId } = mongoose.Types;

const roleInsert = async (roleObj) => {
  const res = await Role.create(roleObj);
  return res;
};

const roleFindAll = async (options = null) => {
  const res = await Role.find({}, options);
  return res;
};

const roleFindById = async (id) => {
  const res = await Role.findById(ObjectId(id));
  return res;
};

const roleFindByIdAndUpdate = async (id, update) => {
  const res = await Role.findByIdAndUpdate(ObjectId(id), update);
  return res;
};

const idFind = async (query) => {
  const res = await Role.find({ id: query });
  return res;
};

const idFindOne = async (query) => {
  const res = await Role.findOne({ id: query });
  return res;
};

const roleCount = async () => {
  const res = await Role.estimatedDocumentCount();
  return res;
};

export {
  roleInsert,
  idFind,
  idFindOne,
  roleFindAll,
  roleCount,
  roleFindById,
  roleFindByIdAndUpdate,
};
