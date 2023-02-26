import request from 'utils/request';
import { stringify } from 'qs';

import api from './api';

// 请求地址是当前访问地址
// const apiPrefix = isDevelopment ? 'https://dev-minalogin.beautifulreading.com' : 'https://minalogin.beautifulreading.com'
const apiPrefix = GLOBAL_CONFIG.API_URL;
// const apiPrefix = (() => {
//   const defaultHost = 'https://dev-minalogin.beautifulreading.com/'
//   if (isDevelopment || /^[\d]|localhost/.test(window.location.host)) return defaultHost
//   return `${window.location.origin}`
// })()

// console.log('apiPrefix', apiPrefix)

const gen = (params) => {
  let method = 'GET';
  let url = apiPrefix + params;

  const paramsArray = params.split(' ');
  if (paramsArray.length === 2) {
    const [_method, _url] = paramsArray;
    method = _method;
    url = apiPrefix + _url;
  }

  return (data = {}) => {
    const options: any = { method };

    if (method === 'GET') {
      options.params = { ...data };
      return request.get(url, options);
    }

    if (method === 'URL') {
      return `${url}?${stringify(data)}`;
    }

    // POST
    options.data = { ...data };
    return request.post(url, options);
  };
};

const get = (url, params) => {
  const options: any = { method: 'GET' };
  options.params = { ...params };
  const ret = request.get(url, options);
  console.log('!!!ret', ret);
  return ret;
};

const APIFunction: any = {};

Object.keys(api).forEach((key) => {
  APIFunction[key] = gen(api[key]);
});

APIFunction.get = get;

export default APIFunction;
