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
import {
  getOccList,
} from '../occ';

export const get = [
  /**
   * @api {get} /order/list 訂單列表接口
   * @apiPermission login admin
   * @apiName orderList
   * @apiGroup order
   *
   * @apiParam {String} orderId 訂單編號
   * @apiParam {String} name 訂單姓名
   * @apiParam {String} phone 訂單電話
   * @apiParam {String} nationality 訂單國籍
   * @apiParam {String} breakfast 早餐
   * @apiParam {Number} status 訂單狀態
   * @apiParam {Number} createStartTime 訂單開始時間
   * @apiParam {Number} createEndTime 訂單結束時間
   */
  ['/order/list',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    getOrder],

  /**
   * @api {get} /order/occ/{orderCid} 訂單房間明細接口
   * @apiPermission login admin
   * @apiName occDetail
   * @apiGroup order
   */
  ['/order/occ/*',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    getOccList],
];

export const post = [
  /**
 * @api {post} /order/add 新增訂單接口
 * @apiPermission login admin
 * @apiName orderAdd
 * @apiGroup Order
 *
 * @apiParam {String} name 訂單姓名
 * @apiParam {String} phone 訂單電話
 * @apiParam {String} email 訂房電子郵件
 * @apiParam {String} nationality 訂單國籍
 * @apiParam {String} note 訂單備註
 * @apiParam {Array}  roomInfo 訂房房間信息
 * roomInfo example:
 * [
 *    { date: 20190217, roomCid: '5c5ed89dd6b4f80dbe3c1281' },
 *    { date: 20190217, roomCid: '5c5ed89dd6b4f80dbe3c1281' },
 *    ...
 * ]
 */
  ['/order/add',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    addOrder],

  // ⚠️ 暫時不能用
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
