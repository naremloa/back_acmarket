import {
  middlewareCheckLoginStatusSession,
  middlewareCheckAuthorization,
} from '../../utils/session';
import {
  getMaint,
  addMaint,
  updateMaint,
} from '../maint';

export const get = [
  ['/maint/list',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    getMaint],
];

export const post = [
  ['/maint/add',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    addMaint],

  ['/maint/update',
    middlewareCheckLoginStatusSession, middlewareCheckAuthorization,
    updateMaint],
];
