import { outputSuccess, outputError } from '../utils/outputFormat';
import { omitDateKey, formatDateKey } from '../utils/formatQuery';
import {
  roomFind,
  roomInsert,
} from '../models/room';

const getMaintenance = async (req, res) => {
  const { query } = req;
  const dateCheck = ['create', 'modify'];
  const localQuery = omitDateKey(dateCheck, query);
  const dateQuery = formatDateKey(dateCheck, query);

  const maintenance = await roomFind({ ...localQuery, ...dateQuery });
  return res.send(outputSuccess(maintenance));
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
  return res.send(outputError('未知錯誤'));
};

// const updateMaintenance = async (req, res) => {
//   const { body: {  } }
// }

export {
  getMaintenance,
  addMaintenance,
};
