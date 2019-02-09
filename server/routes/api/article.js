import { omitDateKey, formatDateKey } from '../utils/formatQuery';
import { outputSuccess } from '../utils/outputFormat';
import {
  articleFind, articleInsert,
} from '../models/article';

export const getArticleList = async (req, res) => {
  const { query } = req;
  const dateCheck = ['create', 'modify'];
  const localQuery = omitDateKey(dateCheck, query);
  const dateQuery = formatDateKey(dateCheck, query);

  const article = await articleFind({ ...localQuery, ...dateQuery });
  res.send(outputSuccess(article));
};

const createArticleSchema = async ({
  title,
  content,
  img,
  status,
  account,
}) => {
  const nowTime = new Date().getTime();
  return {
    title,
    content,
    img,
    status,
    createTime: nowTime,
    createAccount: account,
    modifyTime: nowTime,
    modifyAccount: account,
  };
};

const checkArticleContent = (content) => {
  // TODO: content html標籤檢查
  console.log('content', content);
  return content;
};

export const addArticle = async (req, res) => {
  const {
    body: {
      title,
      content,
      img,
      status,
    },
    session: sess,
  } = req;
  const { userInfo: { account } } = sess;
  const checkContent = checkArticleContent(content);
  const newArticle = await createArticleSchema({
    title,
    content: checkContent,
    img,
    status,
    account,
  });

  await articleInsert(newArticle);
  return res.send(outputSuccess({}, '新增成功'));
};

export const fake = () => ({});
