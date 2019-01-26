import {
  userFindById,
  userFind,
  userFindByIdAndUpdate,
} from '../models/user';
import {
  outputSuccess,
  outputError,
} from '../utils/outputFormat';
import {
  idFindOne,
} from '../models/role';


const outputUserInfo = (userInfo) => {
  let localUserInfo = userInfo;
  if (localUserInfo.length === undefined) localUserInfo = [localUserInfo];
  return localUserInfo.map(
    ({
      _id, account, accountAlias, status, modifyUser,
      registerTime, modifyTime, lastLoginTime,
    }) => ({
      accountId: _id,
      account,
      accountAlias,
      status,
      modifyUser,
      registerTime,
      modifyTime,
      lastLoginTime,
    }),
  );
};

const getUser = async (req, res) => {
  const list = await userFind({});
  res.send(outputSuccess(outputUserInfo(list)));
};

/**
 * 帳號狀態更新有效規則
 * 未審核狀態 0: 可通過審核(1), 可不通過審核(刪除, 3)
 * 有效狀態 1: 可停用(2)
 * 停用狀態 2: 可啟用(1), 可刪除(3)
 * 刪除狀態 3: 可重新審核(1),
 */
const validStatusChnage = {
  0: [1, 3],
  1: [2],
  2: [1, 3],
  3: [0],
};

const verifyUserStatusChange = (preStatus, afterStatus) => {
  const tmp = validStatusChnage[preStatus];
  return tmp === undefined || tmp.includes(afterStatus);
};

// 更新帳號狀態，包括審核通過，不通過(刪除)。停用另開接口，不再這裡做處理
// 不通過與刪除綁定原因： 若要從刪除狀態恢復，需要重新審核
const updateUserStatus = async (req, res) => {
  const { body: { status, role, id }, session: sess } = req;
  const { userInfo: { account } } = sess;
  const targetUserInfo = await userFindById(id);
  const queryRole = await (role ? idFindOne(role) : role);
  // 驗證值有效和正確性
  if (targetUserInfo && targetUserInfo.status !== 0) return res.send(outputError('更新帳號狀態異常'));
  if (!verifyUserStatusChange(targetUserInfo.status, status)) return res.send(outputError('更新狀態值異常'));
  if (status === 1 && !queryRole) return res.send(outputError('分配角色異常'));

  let update = {
    modifyUser: account,
    modifyTime: new Date().getTime(),
  };
  // 通過操作
  if (status === 1) update = { ...update, status, role: queryRole._id };
  // 不通過操作
  else if (status === 3) update = { ...update, status, softDelete: true };
  const result = await userFindByIdAndUpdate(targetUserInfo._id, update);
  if (result) return res.send(outputSuccess(true));
  return res.send(outputError('更新失敗'));
};

const updateUserRole = async (req, res) => {
  const { body: { role, id }, session: sess } = req;
  const { userInfo: { account } } = sess;
  const targetUserInfo = await userFindById(id);
  const queryRole = await idFindOne(role);
  if (queryRole === null) return res.send(outputError('無此權限'));
  if (targetUserInfo === null) return res.send(outputError('無此用戶'));

  const update = {
    modifyUser: account,
    modifyTime: new Date().getTime(),
    role: queryRole._id,
  };
  const result = await userFindByIdAndUpdate(targetUserInfo._id, update);
  if (result) return res.send(outputSuccess(true));
  return res.send(outputError('更新失敗'));
};

export {
  getUser,
  outputUserInfo,
  updateUserStatus,
  verifyUserStatusChange,
  updateUserRole,
};
