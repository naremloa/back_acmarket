import {
  getOrderSelf,
  addOrder,
  changeStatusOrder,
  getOrderOther,
  delOrder,
} from '../order';

export const get = [
  ['/order/get/self', getOrderSelf],
  ['/order/get/other', getOrderOther],
];

export const post = [
  ['/order/add', addOrder],
  ['/order/status/change', changeStatusOrder],
  ['/order/del', delOrder],
  // ['/furniture/edit', editFurniture],
  // ['/furniture/sign', signOwner],
];
