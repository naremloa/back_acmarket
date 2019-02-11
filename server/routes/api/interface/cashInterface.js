import {
  middlewareCheckLoginStatusSession,
  middlewareCheckAuthorization,
} from '../../utils/session';
import {
  getCashList,
  addCash,
  updateCash,
} from '../cash';

export const get = [
  ['/cash/list',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    getCashList],
];

export const post = [
/**
 * @api {post} /cash/add 新增收支明細接口
 * @apiPermission login admin
 * @apiName cashAdd
 * @apiGroup Cash
 *
 * @apiParam {String} certificateNumber 憑證號
 * @apiParam {String} content 摘要
 * @apiParam {Number} income 收入
 * @apiParam {Number} outcome 支出
 * @apiParam {Number} type 帳單類型
 */
  ['/cash/add',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    addCash],

  /**
 * @api {post} /cash/update 修改收支明細接口
 * @apiPermission login admin
 * @apiName cashUpdate
 * @apiGroup Cash
 *
 * @apiParam {String} certificateNumber 憑證號
 * @apiParam {String} content 摘要
 * @apiParam {Number} income 收入
 * @apiParam {Number} outcome 支出
 * @apiParam {Number} type 帳單類型
 */
  ['/cash/update',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    updateCash],
];
