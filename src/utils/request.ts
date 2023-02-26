/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { Toast } from 'antd-mobile';
import { terminalType } from '@/models/browser';

import Cookies from 'js-cookie';
import config from 'utils/config';
import { platform } from 'utils/utils';

type codeOptions = {
  [key: number]: string
}

const codeMessage: codeOptions = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response, message: string }): Response => {
  const { response, message } = error;
  if (message === 'jumpToLoginPage') {
    throw new Error('jumpToLoginPage');
  }

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    // Toast.info(`请求错误 ${status}: ${url}, ${errorText}`, 3);
    console.error(`请求错误 ${status}: ${url}, ${errorText}`);
  } else if (!response) {
    Toast.info('您的网络发生异常，无法连接服务器', 3);
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  // credentials: 'include', // 默认请求是否带上cookie
  // timeout: 1000 * 10, // TODO: 打开后，消息收发成功也会有timeout异常
  requestType: 'json', // default
  // prefix: '',
  // headers: {
  //   mtoken: mtoken || '',
  // }
});

// request拦截器, 改变url 或 options.
request.interceptors.request.use((url, options) => {
  const mtoken: string | undefined = Cookies.get(`${config.storageNamespace}mtoken`);
  const otoken: string | undefined = Cookies.get(`${config.storageNamespace}otoken`);
  const cid: string | undefined = Cookies.get(`${config.storageNamespace}cid`);
  const loginState: string | undefined = Cookies.get(`${config.storageNamespace}loginState`);
  const brSession: string | undefined = Cookies.get(`${config.storageNamespace}brSession`);

  const opt = options;
  const headers: any = {
    ...opt.headers,
    hcode: '100',
    'terminal-type': terminalType,
    'br-session': brSession,
  };

  if (mtoken && loginState === 'y') {
    headers.mtoken = mtoken;
  }

  if (otoken) {
    if (loginState === 'y') {
      headers.otoken = otoken;
    } else if (url.indexOf('sendValidateCode') >= 0 || url.indexOf('oauthMobileUserLogin') >= 0 || url.indexOf('getPublicUserInfo') >= 0) {
      // 只有登录相关接口，带上otoken，其他的不带
      headers.otoken = otoken;
    }
  }

  opt.headers = headers;

  opt.params = opt.params && {
    ...opt.params,
    client_id: cid,
  };

  opt.data = opt.data && {
    ...opt.data,
    client_id: cid,
  };

  return {
    url,
    options: {
      ...opt,
    },
  };
});

let timerJumpLoginPage;
request.interceptors.response.use(async (res) => {
  const data = await res.clone().json();
  if (data.head && data.head.code === 40001) {
    const mtoken: string | undefined = Cookies.get(`${config.storageNamespace}mtoken`);
    // const otoken: string | undefined = Cookies.get(`${config.storageNamespace}otoken`);
    const url = window.location.href;
    Cookies.remove(`${config.storageNamespace}mtoken`);

    if (platform.isWeixin) {
      const loginState: string | undefined = Cookies.get(`${config.storageNamespace}loginState`);
      if (loginState === 'y') {
        // 登录状态下，才需要去掉otoken重新授权
        Cookies.remove(`${config.storageNamespace}otoken`);
        Cookies.remove(`${config.storageNamespace}loginState`);
        window.location.reload();
        return res;
      }

      if (url.indexOf('sendValidateCode') >= 0 || url.indexOf('oauthMobileUserLogin') >= 0 || url.indexOf('getPublicUserInfo') >= 0) {
        // 非登录状态，但尝试登录失败，清理掉otoken
        Cookies.remove(`${config.storageNamespace}otoken`);
        window.location.reload();
        return res;
      }
    }

    Cookies.remove(`${config.storageNamespace}loginState`);
    if (platform.isMiniProgram) {
      if (mtoken) {
        // 只回退一次
        // eslint-disable-next-line no-undef
        wx.miniProgram.navigateBack({ delta: 1 });
      }
    } else if (url.indexOf('/login') === -1) {
      if (!timerJumpLoginPage) {
        timerJumpLoginPage = setTimeout(() => {
          timerJumpLoginPage = null;
        }, 1000);
        const { location } = window;
        const fullPath = `${location.protocol}//${location.hostname}:${location.port}/${GLOBAL_CONFIG.BASE_PATH}/login`;
        console.log('fullPath', fullPath);
        const redirect = encodeURIComponent(`${location.pathname.replace(`/${GLOBAL_CONFIG.BASE_PATH}`, '')}${location.search}`);
        window.location.replace(`${fullPath}?redirect=${redirect}`);
      }
      throw new Error('jumpToLoginPage');
    }
  }
  return res;
});

export default request;
