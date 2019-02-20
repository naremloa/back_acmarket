import { Models } from '../../db';

const { Occ } = Models;

const occFind = async (query) => {
  const res = await Occ.find(query);
  return res;
};

const occInsertMany = async (arr) => {
  const res = await Occ.insertMany(arr);
  return res;
};

export {
  occFind,
  occInsertMany,
};
