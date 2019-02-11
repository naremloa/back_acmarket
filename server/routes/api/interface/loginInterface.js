import {
  middlewareValidateSession,
} from '../../utils/session';
import {
  getCode,
  registerAccount,
  login,
  logout,
} from '../login';

export const get = [
/**
 * @api {get} /login/code 驗證碼接口
 * @apiPermission none
 * @apiName GetCode
 * @apiGroup Login
 *
 * @apiSuccess {String} code 驗證碼圖片d（svg標籤）
 *
 * @apiSuccessExample Success-Response:
 *  response status 200
 *  {
 *      "code": "0",
 *      "msg": "Success",
 *      "data": {
 *        "code": "<svg ...><path .../></svg>"
 *      }
 *  }
 */
  ['/login/code', getCode],
];

export const post = [
/**
 * @api {post} /login/register 註冊接口
 * @apiPermission none
 * @apiName register
 * @apiGroup Login
 *
 * @apiParam {String} account 帳號名稱
 * @apiParam {String} password 帳號密碼
 * @apiParam {String} code 驗證碼
 * @apiParamExample {json} Request-example:
 * {
 *    "account": "test",
 *    "password": "123qwe",
 *    "code": "12"
 * }
 *
 * @apiSuccessExample Success-Response:
 * response status 200
 * {
 *    "code": "0",
 *    "msg": "Success",
 *    "data": {}
 * }
 */
  ['/login/register', middlewareValidateSession, registerAccount],

  // 登入接口
  ['/login/testLogin', middlewareValidateSession, login],

  // 登出接口
  ['/login/logout', logout],
];
