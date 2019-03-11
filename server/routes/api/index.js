import express from 'express';
import * as login from './interface/loginInterface';
import * as order from './interface/orderInterface';
import * as router from './interface/routerInterface';
import * as user from './interface/userInterface';
import * as maint from './interface/maintInterface';
import * as cash from './interface/cashInterface';
import * as global from './interface/globalInterface';
import * as front from './interface/frontInterface';
import * as room from './interface/roomInterface';
import * as occ from './interface/occInterface';
import * as activity from './interface/activityInterface';

const exRouter = express.Router();

const getKey = 'get';
const postKey = 'post';
const registerInterface = [
  login, order, router, user, maint, cash, global, front, room, occ, activity,
];

registerInterface.forEach((rInterface) => {
  (rInterface[getKey] ? rInterface[getKey] : []).forEach(i => exRouter.get(...i));
  (rInterface[postKey] ? rInterface[postKey] : []).forEach(i => exRouter.post(...i));
});

module.exports = exRouter;
