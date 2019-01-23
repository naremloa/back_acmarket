import { outputSuccess, outputError } from '../utils/outputFormat';
import {
  roleFindAll,
  roleCount,
  roleInsert,
} from '../models/role';

// 排除遊客和super
const getRoleList = async (req, res) => {
  const result = (await roleFindAll('id name'))
    .map(({ id, name }) => ({ id, value: name }))
    .filter(({ id }) => ![0, 1000].includes(id));
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
  if (!routerGroup || routerGroup.length === undefined) {
    return res.send(outputError('新增參數有誤'));
  }

  const roleObj = createRoleSchema({ id: newId, name, routerGroup });
  const result = await roleInsert(roleObj);
  if (result) return res.send(outputSuccess(true));
  return res.send(outputError('資料庫異常'));
};

export {
  createRoleSchema,
  getRoleList,
  addRole,
};
