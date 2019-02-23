import {
  middlewareCheckLoginStatusSession,
  middlewareCheckAuthorization,
} from '../../utils/session';
import {
  addSubRoom,
  getRoomOption,
} from '../room';

export const post = [
  ['/room/subRoom/add', middlewareCheckLoginStatusSession, addSubRoom],
];

export const get = [
  ['/room/options', middlewareCheckLoginStatusSession, getRoomOption],
];
