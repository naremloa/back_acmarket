import {
  middlewareCheckLoginStatusSession,
  middlewareCheckAuthorization,
} from '../../utils/session';
import {
  getOrder,
  addOrder,
  updateOrder,
  updateOrderStatus,
} from '../order';

export const get = [
// 訂單接口
  ['/order/list',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    getOrder],
];

export const post = [
  /**
 * @api {post} /order/add 新增訂單接口
 * @apiPermission login admin
 * @apiName orderAdd
 * @apiGroup Order
 *
 * @apiParam {String} name 訂房姓名
 * @apiParam {String} phone 訂房電話
 * @apiParam {String} nationality 訂房人國籍
 * @apiParam {Number} checkInTime 入住時間
 * @apiParam {Number} checkOutTime 退房時間
 * @apiParam {Number} roomType 訂房房型
 * @apiParam {Number} price 房型單價
 * @apiParam {Number} totalPrice 總價
 * @apiParam {String} note 備註
 */
  ['/order/add',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    addOrder],

  /**
 * @api {post} /order/update 更新訂單接口
 * @apiPermission login admin
 * @apiName orderUpdate
 * @apiGroup Order
 *
 * @apiParam {String} cid 訂單id
 * @apiParam {String} name 訂房姓名
 * @apiParam {String} phone 訂房電話
 * @apiParam {String} nationality 訂房人國籍
 * @apiParam {Number} checkInTime 入住時間
 * @apiParam {Number} checkOutTime 退房時間
 * @apiParam {Number} roomType 訂房房型
 * @apiParam {Number} price 房型單價
 * @apiParam {Number} totalPrice 總價
 * @apiParam {String} note 備註
 */
  ['/order/update',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    updateOrder],

  /**
 * @api {post} /order/update/statis 更新訂單狀態接口
 * @apiPermission login admin
 * @apiName orderUpdateStatus
 * @apiGroup Order
 *
 * @apiParam {String} cid 訂單id
 * @apiParam {Number} status 訂單狀態
 */
  ['/order/update/status',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    updateOrderStatus],
];
