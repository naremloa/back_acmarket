import { outputSuccess, outputError } from '../utils/outputFormat';
import { omitDateKey, formatDateKey } from '../utils/formatQuery';
import {
  roomFind,
  roomInsert,
  maintenanceFindByIdAndUpdate,
} from '../models/room';

const getMaintenance = async (req, res) => {
  const { query } = req;
  const dateCheck = ['create', 'modify'];
  const localQuery = omitDateKey(dateCheck, query);
  const dateQuery = formatDateKey(dateCheck, query);

  const maintenance = await roomFind({ ...localQuery, ...dateQuery });
  return res.send(outputSuccess(maintenance));
};

const createMaintenanceSchema = async ({
  roomId,
  position,
  content,
  internalCost,
  outsourceCost,
  note,
  account,
}) => {
  const nowTime = new Date().getTime();
  return {
    id: roomId,
    position,
    content,
    internalCost,
    outsourceCost,
    note,
    createTime: nowTime,
    createAccount: account,
    modifyTime: nowTime,
    modifyAccount: account,
  };
};

const addMaintenance = async (req, res) => {
  const {
    body: {
      roomId,
      position,
      content,
      internalCost,
      outsourceCost,
      note,
    },
    session: sess,
  } = req;
  const { userInfo: { account } } = sess;
  const newMaintenance = await createMaintenanceSchema({
    roomId,
    position,
    content,
    internalCost,
    outsourceCost,
    note,
    account,
  });

  await roomInsert(newMaintenance);
  return res.send(outputSuccess({}, '無敵破壞光線～～biu biu biu'));
};

const updateMaintenance = async (req, res) => {
  const {
    body: {
      cid,
      position,
      content,
      internalCost,
      outsourceCost,
      note,
    },
    session: sess,
  } = req;
  const { userInfo: { account } } = sess;
  const nowTime = new Date().getTime();
  const updateObj = {
    position,
    content,
    internalCost,
    outsourceCost,
    note,
    modifyTime: nowTime,
    modifyAccount: account,
  };
  await maintenanceFindByIdAndUpdate(cid, updateObj);
  return res.send(outputSuccess({}, '老婆兒老婆兒，啊啊啊啊，幸苦咧'));
};

export {
  getMaintenance,
  addMaintenance,
  updateMaintenance,
};
