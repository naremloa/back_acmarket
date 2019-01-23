import { Models } from '../../db';

const { User: Login } = Models;

// TODO: 对资料做简易验证，包括必填等

const userFindOne = async (query) => {
  const res = await Login.findOne(query).populate('role');
  return res;
};

const userInsert = async (userObj) => {
  const res = await Login.create(userObj);
  return res;
};

const userCount = async () => {
  const res = await Login.estimatedDocumentCount();
  return res;
};

const userFindOneAndUpdate = async (query, update) => {
  const res = await Login.findOneAndUpdate(query, update);
  return res;
};

export {
  userFindOne,
  userInsert,
  userCount,
  userFindOneAndUpdate,
};
