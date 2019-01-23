import axios from 'axios';

// 创建axios实例
const service = axios.create({
  timeout: 20000, // 请求超时时间
  validateStatus: status => status >= 200 && status < 500,
});

export default service;
