import axios from 'axios';
import {Message} from 'element-ui';
import qs from 'qs';

export const config = {
  baseURL: process.env.NODE_ENV === 'development' && sessionStorage.getItem('dev_api') ? 'http://' + sessionStorage.getItem('dev_api') : process.env.VUE_APP_BASE_API,
  timeout: 30000, // request timeout
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

const instance = axios.create(config);
instance.interceptors.request.use(config => {
  return config;
}, error => {
  // Do something with request error
  return Promise.reject(error);
});
instance.interceptors.response.use(res => {
  if (res.data.state.code === 2000000) {
    return Promise.resolve(res.data);
  } else if (res.data.state.code === 5000001) {

    // 批量更新情况
    if (res.data.data && res.data.data.length) {
      // 延迟一秒造成防止卡顿
      setTimeout(() => {
        const item = res.data.data[0];
        Message.error(item.error || item.message || '网络错误请重试');
      }, 1000);
    } else {
      Message.error(res.data.state.message || '网络错误请重试');
    }
    // 有一个成功都是成功，所以选择resolve
    return Promise.reject(res.data);
  } else {
    Message.error(res.data.state.message || '网络错误请重试');
    return Promise.reject(res.data);
  }
}, err => {
  console.log(err);
  Message.error('网络错误请重试');
  return Promise.reject(err);
});

export function request(method = 'get', url, params, type = 'json') {
  method = method.toLowerCase();
  const transformData = transform(method, params, type);
  const data = transformData.params;
  const requestConfig = {
    method,
    url,
    headers: {
      'Content-Type': transformData['Content-Type']
    }
  };
  if (method === 'get') {
    requestConfig.params = data;
  } else {
    requestConfig.data = data;
  }
  return instance(requestConfig);
}

function transform(method, params, type) {
  if (type === 'from-data') {
    if (method !== 'get') {
      params = qs.stringify(params);
    }
    return {
      params,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
  } else {
    return {
      params,
      'Content-Type': 'application/json'
    };
  }
}

export default instance;
