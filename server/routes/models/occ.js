import { Models } from '../../db';

const { Occ } = Models;

const occFind = async (query) => {
  const res = await Occ.find(query);
  return res;
};

export {
  occFind,
};
