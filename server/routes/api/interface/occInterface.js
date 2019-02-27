import {
  middlewareCheckLoginStatusSession,
  middlewareCheckAuthorization,
} from '../../utils/session';
import {
  getOccList,
  updateOccSubRoomCid,
} from '../occ';

// ⚠️： 房間和房型有區別

export const post = [
  /**
   * @api {post} /occ/update/subRoomCid
   * @apiPermission login amdin
   * @apiName updateSubRoomCid
   * @apiGroup occ
   *
   * @apiParam {String} cid occ cid
   * @apiParam {String} roomCid 房型cid
   * @apiParam {String} subRoomCid 房間cid
   */
  ['/occ/update/subRoomCid',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    updateOccSubRoomCid],
];

export const get = [
  /**
   * @api {get} /occ/list occ列表接口
   * @apiPermission login admin
   * @apiName occList
   * @apiGroup Occ
   *
   * @apiSuccessExample {json} Success-Response:
   * [
   *    {
   *      "date": 20190226,
   *      "orderRoomCid": "5c5ed89dd6b4f80dbe3c1281",
   *      "roomCid": "5c5ed89dd6b4f80dbe3c1281",
   *      "subRoomCid": "5c5ed89dd6b4f80dbe3c1281",
   *    }
   *    ...
   * ]
   */
  ['/occ/list',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    getOccList],
];
