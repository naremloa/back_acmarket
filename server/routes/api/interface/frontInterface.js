import {
  getLocation,
} from '../location';
import {
  addOrder,
} from '../order';
import {
  getOccList,
} from '../occ';

export const get = [
  ['/front/location/get',
    getLocation],

  /**
   * @api {get} /front/occ/list 佔用表
   * @apiPermission none
   * @apiName occList
   * @apiGroup Front
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "occ": {
   *      "20190226": { A: 2, B: 3, C: 0 },
   *      "20190227": { A: 0, B: 1, C: 2 },
   *      "20190228": { A: 3, B: 1, C: 2 },
   *    },
   *    "info": {
   *      "A": { "length": 3, "name": "太平洋", "price": 3000 },
   *      "B": { "length": 3, "name": "太平洋", "price": 3000 },
   *      "C": { "length": 3, "name": "太平洋", "price": 3000 },
   *    }
   * }
   */
  ['/front/occ/list',
    getOccList],
];

export const post = [
  ['/front/order/new',
    addOrder],
];

// export const post = [
//   ['/front/order/post',
//     addNewOrder],
// ];
