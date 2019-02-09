import {
  middlewareCheckLoginStatusSession,
  middlewareCheckAuthorization,
} from '../../utils/session';
import {
  getMaintenance,
  addMaintenance,
  updateMaintenance,
} from '../room';

export const get = [
  ['/room/maintenance/list',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    getMaintenance],
];

export const post = [
  ['/room/maintenance/add',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    addMaintenance],

  ['/room/maintenance/update',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    updateMaintenance],
];
