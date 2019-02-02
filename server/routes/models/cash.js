import { Models } from '../../db';

const { Cash } = Models;

const cashFind = async (query) => {
  const res = await Cash.find(query);
  return res;
};

export {
  cashFind,
};
