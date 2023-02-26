declare module '*.tsx';
declare module '*.css';
declare module '*.scss';
declare module '*.png';
declare module 'dva-model-extend';
declare module 'qs';
declare module 'api';
declare module 'components';
declare module 'utils/config';
declare module 'utils/model';
declare module 'utils/request';
declare module 'utils/utils';
declare module 'utils/classNames';
declare module 'utils/*';
declare module 'common/product';
declare module 'common/weixin';
declare let GLOBAL_CONFIG: {
    BASE_PATH: string,
    API_URL: string,
    COMPONENT_APPID: string,
    QINIU_CDN: string,
};
declare let wx: any;
declare let WeixinJSBridge: any;
