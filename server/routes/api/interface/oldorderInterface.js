import {
  middlewareCheckLoginStatusSession,
} from '../../utils/session';
import {
  getOrder,
  addOrder,
  updateOrder,
  updateOrderStatus,
  orderTest,
} from '../order';
import {
  getOccDetailList,
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
   * @apiParam {Boolean} outOfTimeSign 即將逾時標誌
   * @apiParam {Boolean} timeOutSign 逾時標誌
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
    getOccDetailList],
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

  /**
 * @api {post} /order/update 更新訂單接口
 * @apiPermission login admin
 * @apiName orderUpdate
 * @apiGroup Order
 *
 * @apiParam {String} cid 訂單id
 * @apiParam {String} name 姓名
 * @apiParam {String} phone 電話
 * @apiParam {String} email 電子郵件
 * @apiParam {String} nationality 國籍
 * @apiParam {String} gender 性別
 * @apiParam {String} breakfast 早餐
 * @apiParam {Number} numberAdult 成人人數
 * @apiParam {Number} numberChild 幼兒人數
 * @apiParam {Array<String>} demand 額外需求
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

  ['/order/test',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    orderTest],
];
