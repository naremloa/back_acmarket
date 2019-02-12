import bcrypt from 'bcrypt';
import { isArray } from 'lodash';
import svgCaptcha from 'svg-captcha';
import {
  userFindOne,
  userInsert,
  userCount,
  userFindOneAndUpdate,
} from '../models/login';
import {
  outputSuccess,
  outputError,
} from '../utils/outputFormat';
import {
  initSession,
  updateLoginStatus,
  updateUserInfo,
} from '../utils/session';
import {
  getRouterAboutRole,
  getRouterAboutAll,
  expandRouter,
} from './router';
import {
  createRoleSchema,
} from './role';
import {
  roleInsert,
  idFindOne,
} from '../models/role';

// bcrypt加密用
const saltRounds = 10;

const getCode = (req, res) => {
  const { session: sess } = req;
  if (sess.loginStatus === true) return res.send(outputError('已登入'));

  const { data, text } = svgCaptcha.createMathExpr({ noise: 2 });
  // TODO: 檢查請求來源

  initSession(sess, text);
  return res.send(outputSuccess({ code: data }));
};

const createAccountSchema = ({
  account, password, role,
}) => {
  const nowTime = new Date().getTime();
  return {
    account,
    password,
    accountAlias: account,
    role: role || undefined,
    level: 0,
    status: 0,
    softDelete: false,
    modifyUser: '',
    registerTime: nowTime,
    modifyTime: nowTime,
    lastLoginTime: nowTime,
  };
};

// 涉及到兩層操作
// 操作1: 判斷是否為初始帳號，若是初始帳號，需要給足權限和跳過審核
// 操作2: 檢查必要數據後創建一般帳號，需要過審核。預設權限為遊客，審核時再指派。
const registerAccount = async (req, res) => {
  const { body: { account, password, code } } = req;
  const { session: sess } = req;
  // TODO: 驗證資料合法性(資料相關)

  // 驗證驗證碼正確性
  if (sess.code !== code) return res.send(outputError('驗證碼錯誤'));

  // 驗證帳號唯一性(資料庫相關)
  // 檢索條件只有帳號，保證資料庫內不存在相同帳號名(包括被刪除，被停用等)
  const result = await userFindOne({ account });
  if (!result) {
    // 創建帳號
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    const count = await userCount();
    // 首個帳號註冊時給足權限和跳過審核
    const guestRole = await idFindOne(0);
    let newAccount = createAccountSchema({
      account, password: passwordHash, role: guestRole && guestRole._id,
    });
    // 初始帳號狀態, 做前置準備
    if (count === 0) {
      let superRole = await idFindOne(1000);
      // 建立遊客角色(id: 0)
      if (!guestRole) await roleInsert(createRoleSchema({ id: 0, name: '遊客' }));
      // 建立super角色(id: 1000)
      if (!superRole) {
        const routerGroup = expandRouter((await getRouterAboutAll())).map(i => i.id);
        superRole = await roleInsert(createRoleSchema({ id: 1000, name: 'super', routerGroup }));
      }
      // 給足初始帳號權限和跳過審核
      newAccount = {
        ...newAccount, status: 1, role: superRole._id,
      };
    }
    await userInsert(newAccount);
    return res.send(outputSuccess({}, '創建成功'));
  }
  return res.send(outputError('帳號已存在', -1));
};

const login = async (req, res) => {
  const { body } = req;
  const { account, password, code = '' } = body;
  const { session: sess } = req;
  // TODO: 驗證資料合法性

  // 驗證帳號是否存在 (檢索條件不包括被刪除帳號)
  const query = { account, softDelete: false };
  const user = await userFindOne(query);
  if (user) {
    const {
      account: queryAccount,
      accountAlias: queryAccountName,
      password: queryPassword,
      role: queryRole,
      status: queryAccountStatus,
    } = user;
    // 對比信息
    const same = await bcrypt.compare(password, queryPassword);
    if (!same) res.send(outputError('帳號或密碼錯誤'));
    else if (sess.code !== code) res.send(outputError('驗證碼錯誤'));
    else if (queryAccountStatus === 0) res.send(outputError('帳號未審核通過'));
    else if (queryAccountStatus === 2) res.send(outputError('帳號被停用'));
    else if (queryAccountStatus === 1) {
      const { routerGroup } = queryRole;
      const routerAboutRole = new Set((await getRouterAboutRole(routerGroup))
        .map(r => r.apiRoot)
        .filter(r => r !== '')
        .reduce((acc, cur) => acc.concat(isArray(cur) ? cur : [cur]), []));
      // success login
      const userInfo = {
        loginStatus: true,
        account: queryAccount,
        accountName: queryAccountName,
        role: queryRole,
        roleApiRoot: [...routerAboutRole],
      };
      updateLoginStatus(sess, true);
      updateUserInfo(sess, userInfo);
      await userFindOneAndUpdate(
        { account: queryAccount },
        { lastLoginTime: new Date().getTime() },
      );
      res.send(outputSuccess(userInfo, '登入成功'));
    } else res.send(outputError('帳號狀態異常'));
    return;
  }
  res.send(outputError('帳號不存在'));
};

const logout = (req, res) => {
  const sess = req.session;
  updateLoginStatus(sess, false);
  res.send(outputSuccess(true));
};

export {
  getCode,
  registerAccount,
  login,
  logout,
};
