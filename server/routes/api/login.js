import bcrypt from 'bcrypt';
import svgCaptcha from 'svg-captcha';
import {
  userFindOne,
  userInsert,
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

// TODO: 統一密碼設置，帳號不另設密碼
const constPwd = 'llfxv20'

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
  account, password,
}) => {
  const nowTime = new Date().getTime();
  return {
    account,
    password,
    accountAlias: account,
    status: 0,
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

  // TODO: 統一密碼設置，帳號不另設密碼
  if (password !== constPwd) return res.send(outputError('密碼錯誤'));

  // 驗證帳號唯一性(資料庫相關)
  // 檢索條件只有帳號，保證資料庫內不存在相同帳號名(包括被刪除，被停用等)
  const result = await userFindOne({ account });
  if (!result) {
    // 創建帳號
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAccount = createAccountSchema({
      account, password: passwordHash,
    });

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
  const query = { account };
  const user = await userFindOne(query);
  if (user) {
    const {
      account: queryAccount,
      accountAlias: queryAccountName,
      password: queryPassword,
      status: queryAccountStatus,
    } = user;
    // 對比信息
    const same = await bcrypt.compare(password, queryPassword);
    if (!same) res.send(outputError('帳號或密碼錯誤'));
    else if (sess.code !== code) res.send(outputError('驗證碼錯誤'));
    else if (queryAccountStatus === 0) {
      // success login
      const userInfo = {
        loginStatus: true,
        account: queryAccount,
        accountName: queryAccountName,
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
