// import { pickBy } from 'lodash';
import { omitDateKey, formatDateKey } from '../utils/formatQuery';

const { Order } = require('../../db').Models;
const { outputSuccess, outputError } = require('../utils/outputFormat');

const getOrder = (req, res) => {
  const { query } = req;
  const dateCheck = ['checkOut', 'checkIn', 'create'];
  const localQuery = omitDateKey(dateCheck, query);
  const dateQuery = formatDateKey(dateCheck, query);
  // const checkQueryKey = (v, k) => queryKey.includes(k) && v !== undefined;
  // const localQuery = pickBy(
  //   query, checkQueryKey,
  // );

  console.log('check', localQuery, dateQuery);
  Order.find({ ...localQuery, ...dateQuery }, (err, docs) => {
    res.send(outputSuccess(docs));
  });

  // // TODO: 查詢值有效性檢查
  // const {
  //   validOrderId = true,
  //   validName = true,
  //   validCheckInTime = true,
  //   validCheckOutTime = true,
  //   validCreateTime = true,
  //   validRoomType = true,
  //   validStatus = true,
  // } = {};

  // const query = {};
  // if (validOrderId) query.orderId = orderId;
  // if (validName) query.name = name;
  // if (validCheckInTime) query.checkInTime = { $gte: checkInStartTime, $lte: checkInEndTime };
  // if (validCheckOutTime) query.checkOutTime = { $gte: checkOutStartTime, $lte: checkOutEndTime };
  // if (validCreateTime) query.createTime = { $gte: createStartTime, $lte: createEndTime };
  // if (validRoomType) query.roomType = roomType;
  // if (validStatus) query.status = status;

  // Order.find(query);
};

export {
  getOrder,
};
