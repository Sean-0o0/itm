/* global window */
import C5axios from 'axios';
// import qs from 'qs';
// import jsonp from 'jsonp';
import lodash from 'lodash';
import pathToRegexp from 'path-to-regexp';
import { message } from 'antd';
import router from 'umi/router';
// import { CORS } from './config';

const getApis = require('./api').default;

const api = getApis && getApis();

const getApi = () => {
  const obj = {};
  Object.keys(api).forEach((key) => {
    Object.assign(obj, api[key]);
  });
  return obj;
};
const objApi = getApi();

// 获取url版本号
export const getVersion = (originUrl) => {
  const str = originUrl.slice(originUrl.lastIndexOf('/') + 1);
  return objApi[`${str}version`] || 'v5.0.0.1';
};

const fetch = (options, config = {}) => {
  const {
    method = 'get',
    data,
    // fetchType,
    url: originUrl,
  } = options;
  const version = getVersion(originUrl);
  const { headers = {} } = config;
  Object.assign(headers, { apiVersion: version });
  Object.assign(config, { headers });

  let url = originUrl;
  const axios = C5axios.create();

  const dataTemp = Object.assign({}, data);

  let cloneData = lodash.cloneDeep(dataTemp);
  if (method !== 'get' && data instanceof FormData) {
    cloneData = data;
  }

  try {
    let domin = '';
    // 如果url前面有协议，域名和端口号，则去掉拿后面的第一个/为开头的部分
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      [domin] = url.match(/[a-zA-z]+:\/\/[^/]*/);
      url = url.slice(domin.length);
    }
    /*
    * 通过pathToRegexp把dataTemp里面的如果url上面有的参数全部拼接到url上面去然后从cloneData里面删除
    * var url = '/user/:id/:name'
    * var data = {id: 10001, name: 'bob'}
    * /user/10001/bob
    */
    const match = pathToRegexp.parse(url);
    url = pathToRegexp.compile(url)(dataTemp);
    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name];
      }
    }
    url = domin + url;
  } catch (e) {
    message.error(e.message);
  }

  // if (fetchType === 'JSONP') {
  //   return new Promise((resolve, reject) => {
  //     jsonp(url, {
  //       param: `${qs.stringify(data)}&callback`,
  //       name: `jsonp_${new Date().getTime()}`,
  //       timeout: 20000,
  //     }, (error, result) => {
  //       //console.log(888, error, result);
  //       if (error) {
  //         reject(error);
  //       }
  //       resolve({ statusText: 'OK', status: 200, data: result });
  //     });
  //   });
  // }

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
        ...config,
      });
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
        ...config,
      });
    case 'post':
      return axios.post(url, cloneData, config);
    case 'put':
      return axios.put(url, cloneData, config);
    case 'patch':
      return axios.patch(url, cloneData, config);
    default:
      return axios({ ...options, url, ...config });
  }
};

export default function request(options, config = {}) {
  const newOptions = { ...options };
  // if (newOptions.url && newOptions.url.indexOf('//') > -1) {
  //   // origin为前面的域名
  //   const origin = `${newOptions.url.split('//')[0]}//${newOptions.url.split('//')[1].split('/')[0]}`;
  //   if (window.location.origin !== origin) {
  //     if (CORS && CORS.indexOf(origin) > -1) {
  //       newOptions.fetchType = 'CORS';
  //     } else {
  //       newOptions.fetchType = 'JSONP';
  //     }
  //   }
  // }
  return fetch(newOptions, config).then((response) => {
    const { statusText, status } = response;
    let { data } = response;
    if (data instanceof Array) {
      data = {
        list: data,
      };
    } else if (data instanceof Object) {
      // 处理接口返回的数据错误
      const { code = 0, records = [] } = data;
      if (code <= 0) {
        let recordsTemp = records;
        //
        if (records === 'null' || records === null) {
          recordsTemp = undefined;
        }
        return Promise.reject({ response: { success: true, statusCode: status, message: statusText, ...data, records: recordsTemp } });  // eslint-disable-line
      }
    }
    return Promise.resolve({
      success: true,
      message: statusText,
      statusCode: status,
      ...data,
    });
  }).catch((error) => {
    const { response } = error;
    let msg;
    let statusCode;
    if (response && response instanceof Object) {
      const { success, data, statusText } = response;
      if (success) {
        return Promise.reject(response);
      }
      statusCode = response.status;
      msg = data.note || statusText;
    } else {
      statusCode = 600;
      msg = error.note || '网络错误';
    }
    if (statusCode === 900) {
      const loginStatus = window.sessionStorage.getItem('loginStatus') || '0'; // 登录状态: 0|未登录;1|已登录;-1|过期;
      if (loginStatus === '1') {
        message.error('会话过期', /* duration */3);
      }
      sessionStorage.setItem('user', null); // 清空会话
      window.sessionStorage.setItem('loginStatus', '-1'); // 登录状态为未登录
      if (window.location.href.indexOf('/login') === -1) {
        router.push('/login');
      }
    }
    return Promise.reject({ success: false, statusCode, message: msg }); // eslint-disable-line
  });
}

// eslint-disable-next-line arrow-parens
export const poster = (url) => (data, options) => (
  request({ url, data, method: 'post', ...options })
);
