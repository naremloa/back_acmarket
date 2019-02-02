import { Models } from '../../db';

const { Cash } = Models;

const cashFind = async (query) => {
  const res = await Cash.find(query);
  return res;
};

const cashCount = async () => {
  const res = await Cash.estimatedDocumentCount();
  return res;
};

const cashInsert = async (cashObj) => {
  const res = await Cash.create(cashObj);
  return res;
};

export {
  cashFind,
  cashCount,
  cashInsert,
};
