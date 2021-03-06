import express from 'express';
import * as login from './interface/loginInterface';
import * as furniture from './interface/furnitureInterface';
import * as order from './interface/orderInterface';
import * as turnip from './interface/turnipInterface';

const exRouter = express.Router();

const getKey = 'get';
const postKey = 'post';
const registerInterface = [
  login, furniture, order, turnip,
];

registerInterface.forEach((rInterface) => {
  (rInterface[getKey] ? rInterface[getKey] : []).forEach(i => exRouter.get(...i));
  (rInterface[postKey] ? rInterface[postKey] : []).forEach(i => exRouter.post(...i));
});

module.exports = exRouter;
