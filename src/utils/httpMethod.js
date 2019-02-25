import { isEmpty, has, assign } from 'lodash';
import request from './request';

async function httpMethod({
  url,
  method = 'GET',
  headers = {},
  params,
  data,
}) {
  if (isEmpty(headers)) headers = null;
  // 重整respond格式
  let res = null;
  const responseData = {
    data: null,
    code: 0,
    msg: 'Success',
  };
  try {
    res = await request({
      headers,
      url,
      method,
      params,
      data,
    });
  } catch (error) {
    console.log('error', error);
    res = null;
  }
  if (!res) {
    return {
      ...responseData,
      code: 1,
      msg: '伺服器端無回應，請稍號再弒，或聯絡服務人員',
    };
  }
  if (
    res
    && has(res.data, 'data')
    && has(res.data, 'code')
    && has(res.data, 'msg')
  ) return res.data;
  return assign(responseData, res.data);
}

export default httpMethod;
