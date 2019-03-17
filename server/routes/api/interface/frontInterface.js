import {
  getLocation,
} from '../location';
import {
  addOrder,
  checkOrder,
} from '../order';
import {
  getOcc,
} from '../occ';
import {
  checkNotAllowingRooms,
} from '../room';

async function checkRoom(req, res, next) {
  const result = await checkNotAllowingRooms();
  // 有被停用的房型
  if (result) return;
  next();
}

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
   *      "A": {
   *        "length": 3,
   *        "name": "太平洋",
   *        "price": {
   *          "lowSeasonWeekday": 1500,
   *          "lowSeasonWeekend": 2500,
   *          "peakSeasonWeekday": 2000,
   *          "peakSeasonWeekend": 3000,
   *        },
   *      },
   *      "B": {
   *        "length": 3,
   *        "name": "太平洋",
   *        "price": {
   *          "lowSeasonWeekday": 1500,
   *          "lowSeasonWeekend": 2500,
   *          "peakSeasonWeekday": 2000,
   *          "peakSeasonWeekend": 3000,
   *        },
   *      },
   *    }
   * }
   */
  ['/front/occ/list',
    checkRoom,
    getOcc],
];

export const post = [
  /**
   * @api {post} /front/order/new 添加新訂單
   * @apiPermission none
   * @apiName frontOrderNew
   * @apiGroup Front
   *
   * @param {String}  name 訂單人姓名
   * @param {String}  phone 訂單人電話
   * @param {String}  email 訂單人電子郵箱
   * @param {String}  nationality 訂單人國際
   * @param {String}  gender 訂單人性別
   * @param {String}  breakfast 早餐需求
   * @param {Number}  numberAdult 成人人數
   * @param {Number}  numberChild 幼兒人數
   * @param {String}  note 備註
   * @param {Boolean} join 是否参与活动
   * @param {Array<String>}  demand 訂單人額外需求
   * @param {Array<Object>}  roomInfo 訂房明細
   */
  ['/front/order/new',
    addOrder],

  /**
   * @api {post} /front/check/order 確認訂單價錢明細
   * @apiPermission none
   * @apiName checkOrder
   *
   * @param {Array<Object>} roomInfo 訂房明細(同新增訂單)
   */
  ['/front/check/order',
    checkOrder],
];
