const { outputError } = require('../utils/outputFormat');

export const initSession = (sess, text) => {
  sess.code = text;
  sess.codeValid = true;
  sess.loginStatus = false;
};

export const validateSession = (sess, res) => {
  // 驗證碼檢查
  let status = true;
  // session不存在(超過存在時間)或驗證碼失效(登入失敗)
  if (sess.code === null || !sess.codeValid) {
    res.send(outputError('驗證碼失效或超時'));
    status = false;
  }
  // 實現驗證碼的一次性
  sess.codeValid = false;
  return status;
};

export const middlewareValidateSession = (req, res, next) => {
  if (!validateSession(req.session, res)) return;
  next();
};

export const updateLoginStatus = (sess, val) => {
  sess.loginStatus = (val === true);
};

export const checkLoginStatusSession = (sess, res) => {
  if (sess && sess.loginStatus === true) return true;
  res.status(401).send(outputError('登入失效'));
  return false;
};

export const middlewareCheckLoginStatusSession = (req, res, next) => {
  if (!checkLoginStatusSession(req.session, res)) return;
  next();
};

export const updateUserInfo = (sess, val) => {
  sess.userInfo = val;
};

export const middlewareCheckAuthorization = (req, res, next) => {
  const { session: { userInfo: { roleApiRoot = ['/global'] } }, path } = req;
  const localRoleApiRoot = new Set([...roleApiRoot, '/global']);
  if ([...localRoleApiRoot].find(i => (new RegExp(`^${i}`)).test(path))) next();
  else res.status(401).send(outputError('無此權限'));
};
