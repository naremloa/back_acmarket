import {
  getOrderSelf,
  addOrder,
  changeStatusOrder,
  getOrderOther,
} from '../order';

export const get = [
  ['/order/get/self', getOrderSelf],
  ['/order/get/other', getOrderOther],
];

export const post = [
  ['/order/add', addOrder],
  ['/order/status/change', changeStatusOrder],
  // ['/furniture/edit', editFurniture],
  // ['/furniture/sign', signOwner],
];
