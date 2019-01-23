import { outputSuccess, outputError } from '../utils/outputFormat';
import {
  roomFind,
  roomInsert,
} from '../models/room';

const getMaintenance = async (req, res) => {
  const result = await roomFind({});
  return res.send(outputSuccess(result));
};

const addMaintenance = async (req, res) => {
  const {
    body: {
      roomId: id,
      position,
      content,
      internalCost,
      outsourceCost,
      note,
      createTime,
      createAccount,
      modifyTime,
      modifyAccount,
    },
  } = req;
  // TODO: 檢驗存儲資料合法性

  const roomObj = {
    id,
    position,
    content,
    internalCost,
    outsourceCost,
    note,
    createTime,
    createAccount,
    modifyTime,
    modifyAccount,
  };
  const result = await roomInsert(roomObj);
  if (result) return res.send(outputSuccess(true));
  res.send(outputError('未知錯誤'));
};

// const updateMaintenance = async (req, res) => {
//   const { body: {  } }
// }

export {
  getMaintenance,
  addMaintenance,
};
