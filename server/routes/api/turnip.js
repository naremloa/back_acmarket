import {
  turnipFind,
  turnipFindOne,
  turnipInsert,
  turnipFindById,
  turnipFindByIdAndUpdate,
} from '../models/turnip';
import {
  outputSuccess,
  outputError,
} from '../utils/outputFormat';

const generateScope = (date) => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const h = date.getHours();
  const type = h >= 12 ? 'aft' : 'mor';
  const tmp = {
    mor: { min: 8, max: 12 },
    aft: { min: 12, max: 22 },
  }
  const min = new Date(`${y}-${m}-${d} ${tmp[type].min}:00:00`).getTime();
  const max = new Date(`${y}-${m}-${d} ${tmp[type].max}:00:00`).getTime();
  return [min, max];
}

const getTurnip = async (req, res) => {
  const { session: sess } = req;
  const userName = sess.userInfo && sess.userInfo.account;
  if (!userName) return res.send(outputError('無效操作用戶'));
  const [minTime, maxTime] = generateScope(new Date());
  const query = {
    createTime: { $gte: minTime, $lt: maxTime }
  };
  const result = await turnipFind(query);
  return res.send(outputSuccess(result))
};

const createTurnipSchema = ({
  price = 0, createUser, time = new Date().getTime()
}) => {
  return {
    price,
    createUser,
    createTime: time,
    updateTime: time,
  };
};

const editTurnip = async (req, res) => {
  const { body: { price }, session: sess } = req;
  const userName = sess.userInfo && sess.userInfo.account;
  if (!userName) return res.send(outputError('無效操作用戶'));
  const nowTime = new Date();
  if (nowTime.getHours() < 8 || nowTime.getHours() > 22) {
    return res.send(outputError('黑心商店還沒開門'));
  }
  const [minTime, maxTime] = generateScope(nowTime);
  const query = {
    createTime: { $gte: minTime, $lt: maxTime },
    createUser: userName,
  };
  const item = await turnipFindOne(query);
  // 修改
  if (item) {
    const { _id: id } = item;
    item.price = price
    item.updateTime = nowTime.getTime();
    await turnipFindByIdAndUpdate(id, item);
    const result = await turnipFindById(id);
    return res.send(outputSuccess(result, '更新成功'));
  // 新增
  } else {
    const newTurnip = createTurnipSchema({
      price,
      createUser: userName,
      time: nowTime.getTime(),
    });
    const result = await turnipInsert(newTurnip);
    return res.send(outputSuccess(result, '創建成功'));
  }
}

export {
  getTurnip,
  editTurnip,
}