const { Order } = require('../../db').Models;
const { outputSuccess, outputError } = require('../utils/outputFormat');

const getOrder = (req, res) => {
  // const { body } = req;
  // const {
  //   orderId,
  //   name,
  //   checkInStartTime,
  //   checkInEndTime,
  //   checkOutStartTime,
  //   checkOutEndTime,
  //   roomType,
  //   status,
  //   currentPage,
  //   pageSize,

  // } = body;
  Order.find({}, (err, docs) => {
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
