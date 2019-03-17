import {
  middlewareCheckLoginStatusSession,
  middlewareCheckAuthorization,
} from '../../utils/session';
import {
  addSubRoom,
  getRoomOption,
  updateRoom,
  updateSubRoom,
  getRoomAll,
  toggleAllowingRoom,
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
  ['/room/subRoom/add',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    addSubRoom],

  /**
   * @api {post} /room/update 更新房型信息
   * @apiPermission login admin
   * @apiName roomUpdate
   *
   * @apiParam {String} cid 房型cid
   * @apiParam {String} name 房型名稱
   * @apiParam {Number} lowNormalPrice 淡季平日單價
   * @apiParam {Number} lowHolidayPrice 淡季假日單價
   * @apiParam {Number} peakNormalPrice 旺季平日單價
   * @apiParam {Number} peakHolidayPrice 旺季假日單價
   */
  ['/room/update',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    updateRoom],

  /**
   * @api {post} /room/subRoom/update 更新房間信息
   * @apiPermission login admin
   * @apiName subRoomUpdate
   *
   * @apiParam {String} cid 房型cid
   * @apiParam {String} id 房間id
   * @apiParam {String} name 房間名稱
   */
  ['/room/subRoom/update',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    updateSubRoom],

  /**
   * @api {post} /room/allowing/update 開啟關閉房型
   * @apiPermission login admin
   * @apiName allowingUpdate
   *
   * @apiParam {String} cid 房型cid
   * @apiParam {String} status 房型狀態(true: 開啟, false: 關閉)
   */
  ['/room/allowing/update',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    toggleAllowingRoom],
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
   *    {
   *      "cid": "5c5ed89dd6b4f80dbe3c1281",
   *      "name": "兩人房型",
   *      "child": [
   *        { "cid": "5c5ed89dd6b4f80dbe3c1281", "name": "太平洋房" },
   *        { "cid": "5c5ed89dd6b4f80dbe3c1281", "name": "大西洋房" },
   *      ]
   *     },
   *    { "cid": "5c5ed89dd6b4f80dbe3c1500","name": "三人房型" },
   * ]
   */
  ['/room/options', middlewareCheckLoginStatusSession, getRoomOption],

  /**
   * @api {get} /room/list 獲取全部房型房間信息
   * @apiPermission login admin
   * @apiName roomList
   * @apiGroup Room
   *
   * @apiSuccessExample {json} Success-Response:
   * [
   *    {
   *      "type": "5c5ed89dd6b4f80dbe3c1281",
   *      "typeName": “兩人房型”,
   *      "id": 1,
   *      "name": "太平洋",
   *      "picList": [],
   *    }
   * ]
   */
  ['/room/list', middlewareCheckLoginStatusSession, getRoomAll],
];
