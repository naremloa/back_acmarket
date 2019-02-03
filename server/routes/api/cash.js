import { omitDateKey, formatDateKey } from '../utils/formatQuery';
import { outputSuccess, outputError } from '../utils/outputFormat';
import {
  cashFind,
  cashCount,
  cashInsert,
  cashFindByIdAndUpdate,
} from '../models/cash';

export const getCashList = async (req, res) => {
  const { query } = req;
  const dateCheck = ['create'];
  const localQuery = omitDateKey(dateCheck, query);
  const dateQuery = formatDateKey(dateCheck, query);

  const cash = await cashFind({ ...localQuery, ...dateQuery });
  res.send(outputSuccess(cash));
};

const createCashSchema = async ({
  certificateNumber,
  content,
  income,
  outcome,
  type,
  account,
}) => {
  const nowTime = new Date().getTime();
  const count = await cashCount();
  return {
    cashId: count + 1,
    certificateNumber,
    content,
    income,
    outcome,
    type,
    balance: 0,
    createTime: nowTime,
    createAccount: account,
    modifyTime: nowTime,
    modifyAccount: account,
  };
};

export const addCash = async (req, res) => {
  const {
    body: {
      certificateNumber,
      content,
      income,
      outcome,
      type,
    },
    session: sess,
  } = req;
  const { userInfo: { account } } = sess;
  const newMaintenance = await createCashSchema({
    certificateNumber,
    content,
    income,
    outcome,
    type,
    account,
  });

  await cashInsert(newMaintenance);
  return res.send(outputSuccess({}, '新增成功'));
};

export const updateCash = async (req, res) => {
  const {
    body: {
      cid,
      certificateNumber,
      content,
      income,
      outcome,
      type,
    },
    session: sess,
  } = req;
  const { userInfo: { account } } = sess;
  const nowTime = new Date().getTime();
  const updateObj = {
    certificateNumber,
    content,
    income,
    outcome,
    type,
    modifyTime: nowTime,
    modifyAccount: account,
  };
  await cashFindByIdAndUpdate(cid, updateObj);
  return res.send(outputSuccess({}, '更新成功'));
};
