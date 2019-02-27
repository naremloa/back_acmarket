import { outputSuccess, outputError } from '../utils/outputFormat';
import {
  roleFindAll,
  roleCount,
  roleInsert,
  roleFindById,
  roleFindByIdAndUpdate,
} from '../models/role';

// 排除遊客和super
const getRoleList = async (req, res) => {
  const result = (await roleFindAll('id name'))
    .map(({ id, name, routerGroup }) => ({ id, value: name, routerGroup }))
    .filter(({ id }) => ![0].includes(id));
    // .filter(({ id }) => ![0, 1000].includes(id));
  return res.send(outputSuccess(result));
};

const createRoleSchema = ({
  id,
  name,
  routerGroup = [],
}) => ({
  id,
  name,
  routerGroup,
});

// 一般權限從1開始算，所以只扣去預設的1000權限
const addRole = async (req, res) => {
  const { body: { name, routerGroup } } = req;
  const newId = await roleCount() - 1;
  if (!routerGroup
      || routerGroup.length === undefined
      || routerGroup.length === 0) {
    return res.send(outputError('新增參數有誤'));
  }

  const roleObj = createRoleSchema({ id: newId, name, routerGroup });
  const result = await roleInsert(roleObj);
  if (result) return res.send(outputSuccess(true));
  return res.send(outputError('資料庫異常'));
};

const updateRole = async (req, res) => {
  const { body: { cid, routerGroup } } = req;
  const targetRole = await roleFindById(cid);
  if (!targetRole) return res.send(outputError('更新角色異常'));

  const updateObj = {
    routerGroup,
  };
  await roleFindByIdAndUpdate(cid, updateObj);
  return res.send(outputSuccess({}, '更新成功'));
};

export {
  createRoleSchema,
  getRoleList,
  addRole,
  updateRole,
};
