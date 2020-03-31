import { isArray } from 'lodash';
import axios from 'axios';
import FormData from 'form-data';
import {
  furnitureFind,
  furnitureInsert,
  furnitureFindById,
  furnitureFindByIdAndUpdate,
} from '../models/furniture';
import {
  outputSuccess,
  outputError,
} from '../utils/outputFormat';

const request = axios.create({
  baseURL: 'https://api.imgur.com/3', // api的base_url
  timeout: 30000, // 请求超时时间
  validateStatus: (status) => status >= 200 && status < 500,
});
const token = 'dd2f828c33721f0af5b31d5bb816a4e58773cdd9';

const getFurniture = async (req, res) => {
  const { session: sess } = req;
  const userName = sess.userInfo && sess.userInfo.account;
  if (!userName) return res.send(outputError('無效操作用戶'));
  const data = await furnitureFind();
  if (isArray(data) && data.length > 0) {
    return res.send(outputSuccess(data));
  }
  return res.send(outputSuccess([]));
}

const createAccountSchema = ({
  name = '', img = '', owner = [], price = 0
}) => {
  const nowTime = new Date().getTime();
  return {
    name,
    img,
    price: price || 0,
    owner,
    createTime: nowTime,
    updateTime: nowTime,
  };
};

const addFurniture = async (req, res) => {
  const {
    body: {
      name, img, price
    },
    session: sess,
  } = req;
  const userName = sess.userInfo && sess.userInfo.account;
  if (!userName) return res.send(outputError('無效操作用戶'));
  const newFurniture = createAccountSchema({
    name, img, price, owner: [userName],
  })
  const result = await furnitureInsert(newFurniture);
  return res.send(outputSuccess(result, '創建成功'));
}

const signOwner = async (req, res) => {
  const { body: { id, status }, session: sess } = req;
  const userName = sess.userInfo && sess.userInfo.account;
  if (!userName) return res.send(outputError('無效操作用戶'));
  const item = await furnitureFindById(id);
  if (!item) return res.send(outputError('無效操作id'));
  if (status && !item.owner.includes(userName)) item.owner.push(userName);
  else if (!status) item.owner = item.owner.filter(i => i !== userName);
  await furnitureFindByIdAndUpdate(id, item);
  const result = await furnitureFindById(id);
  return res.send(outputSuccess(result, '更新成功'));
}
const editFurniture = async (req, res) => {
  const {
    body: {
      _id: id, name, img, price
    },
    session: sess,
  } = req;
  const userName = sess.userInfo && sess.userInfo.account;
  if (!userName) return res.send(outputError('無效操作用戶'));
  let item = await furnitureFindById(id);
  if (!item) return res.send(outputError('無效操作id'));
  const nowTime = new Date().getTime();
  item = { ...item, name, img, price, updateTime: nowTime };
  await furnitureFindByIdAndUpdate(id, item);
  const result = await furnitureFindById(id);
  return res.send(outputSuccess(result, '更新成功'));
}

const uploadImg = async (req, res) => {
  console.log('req', req.file);
  console.log('body', req.body);
  const form = new FormData();
  form.append('image', req.file);
  try {
    const result = await request({
      url: '/image',
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'content-type': 'multipart/form-data',
      },
      data: form,
    })
    delete result.config
    console.log('check result', result);
  } catch (err) {
    console.log('check err', err);
  }

}

export {
  getFurniture,
  addFurniture,
  editFurniture,
  signOwner,
  uploadImg,
};