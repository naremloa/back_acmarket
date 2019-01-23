import { Models } from '../../db';

const { Router } = Models;

const routerFind = async (query) => {
  const res = await Router.find(query);
  return res;
};

export {
  routerFind,
};
