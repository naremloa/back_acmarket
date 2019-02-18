import { outputSuccess, outputError } from '../utils/outputFormat';
import { omitDateKey, formatDateKey } from '../utils/formatQuery';
import {
  maintFind,
  maintInsert,
  maintFindByIdAndUpdate,
} from '../models/maint';

const getMaint = async (req, res) => {
  const { query } = req;
  const dateCheck = ['create', 'modify'];
  const localQuery = omitDateKey(dateCheck, query);
  const dateQuery = formatDateKey(dateCheck, query);

  const maint = await maintFind({ ...localQuery, ...dateQuery });
  return res.send(outputSuccess(maint));
};

const createMaintSchema = async ({
  maintId,
  position,
  content,
  internalCost,
  outsourceCost,
  note,
  account,
}) => {
  const nowTime = new Date().getTime();
  return {
    id: maintId,
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

const addMaint = async (req, res) => {
  const {
    body: {
      maintId,
      position,
      content,
      internalCost,
      outsourceCost,
      note,
    },
    session: sess,
  } = req;
  const { userInfo: { account } } = sess;
  const newMaint = await createMaintSchema({
    maintId,
    position,
    content,
    internalCost,
    outsourceCost,
    note,
    account,
  });

  await maintInsert(newMaint);
  return res.send(outputSuccess({}, '新增成功'));
};

const updateMaint = async (req, res) => {
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
  await maintFindByIdAndUpdate(cid, updateObj);
  return res.send(outputSuccess({}, '更新成功'));
};

export {
  getMaint,
  addMaint,
  updateMaint,
};
