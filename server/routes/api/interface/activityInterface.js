import {
  middlewareCheckLoginStatusSession,
  middlewareCheckAuthorization,
} from '../../utils/session';
import {
  getActivity,
  addActivity,
  toggleActivity,
  modifyActivity,
} from '../activity';

export const get = [
  /**
   * @api {get} /activity/list 活動列表接口
   * @apiPermission login admin
   * @apiName activityList
   * @apiGroup Activity
   */
  ['/activity/list',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    getActivity],
];

export const post = [
  /**
   * @api {post} /activity/add 新增活動接口
   * @apiPermission login admin
   * @apiName activityAdd
   * @apiGroup Activity
   *
   * @apiParam {String} name 活動名稱
   * @apiParam {Number} startTime 開始時間
   * @apiParam {Number} endTime 結束時間
   * @apiParam {Number} roomActivityPrice 房型活動價基數(單位: 分)
   * @apiParam {Number} mag 倍率
   * @apiParam {Number} activityPrice 活動額外價格(單位: 分)
   * @apiParam {Number} remainDay 活動有效天數
   */
  ['/activity/add',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    addActivity],

  /**
   * @api {post} /activity/update 修改活動接口
   * @apiPermission login admin
   * @apiName activityUpdate
   * @apiName activityUpdate
   * @apiGroup Activity
   *
   * @apiParam {String} cid 活動cid
   * @apiParam {String} name 活動名稱
   * @apiParam {Number} startTime 開始時間
   * @apiParam {Number} endTime 結束時間
   * @apiParam {Number} roomActivityPrice 房型活動價基數(單位: 分)
   * @apiParam {Number} mag 倍率
   * @apiParam {Number} activityPrice 活動額外價格(單位: 分)
   * @apiParam {Number} remainDay 活動有效天數
   *
   */
  ['/activity/update',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    modifyActivity],

  /**
   * @api {post} /activity/toggle/status  停啟用接口
   * @apiPermission login admin
   * @apiName activityToggleStatus
   * @apiGroup Activity
   *
   * @apiParam {String} cid activity cid
   * @apiParam {Number} status 狀態(1: 啟用, 2: 停用)
   */
  ['/activity/toggle/status',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    toggleActivity],
];
