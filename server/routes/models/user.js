import { Models } from '../../db';

const { User } = Models;

const userFindById = async (id) => {
  const res = User.findById(id);
  return res;
};

const userFind = async (query) => {
  const res = User.find(query);
  return res;
};

const userFindByIdAndUpdate = async (id, update) => {
  const res = await User.findByIdAndUpdate(id, update);
  return res;
};

export {
  userFindById,
  userFind,
  userFindByIdAndUpdate,
};
