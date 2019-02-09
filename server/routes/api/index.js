import express from 'express';
import * as login from './interface/loginInterface';
import * as order from './interface/orderInterface';
import * as router from './interface/routerInterface';
import * as user from './interface/userInterface';
import * as room from './interface/roomInterface';
import * as cash from './interface/cashInterface';
import * as global from './interface/globalInterface';

const exRouter = express.Router();

const getKey = 'get';
const postKey = 'post';
const registerInterface = [
  login, order, router, user, room, cash, global,
];

registerInterface.forEach((rInterface) => {
  rInterface[getKey].forEach(i => exRouter.get(...i));
  rInterface[postKey].forEach(i => exRouter.post(...i));
});

module.exports = exRouter;
