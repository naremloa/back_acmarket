import {
  middlewareCheckLoginStatusSession,
  middlewareCheckAuthorization,
} from '../../utils/session';
import {
  addSubRoom,
  getRoomOption,
} from '../room';

// ⚠️： 房間和房型有區別

export const post = [
  /**
   * @api {post} /room/subRoom/add 新增房間接口
   * @apiPermission login admin
   * @apiName subRoomAdd
   * @apiGroup Room
   *
   * @apiParam {String} cid 房型cid
   * @apiParam {String} name 房間名稱
   */
  ['/room/subRoom/add', middlewareCheckLoginStatusSession, addSubRoom],
];

export const get = [
  /**
   * @api {get} /room/options 房型options
   * @apiPermission login admin
   * @apiName  roomOptions
   * @apiGroup Room
   *
   * @apiSuccessExample {json} Success-Response:
   * [
   *    { "cid": "5c5ed89dd6b4f80dbe3c1281", "name": "兩人房型" },
   *    { "cid": "5c5ed89dd6b4f80dbe3c1500","name": "三人房型" },
   * ]
   */
  ['/room/options', middlewareCheckLoginStatusSession, getRoomOption],
];
