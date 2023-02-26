import modelExtend from 'dva-model-extend';
import Cookies from 'js-cookie';
import { model } from 'utils/model';
import config from 'utils/config';
import api from 'api';
import actions from 'actions';

import { IClient } from './types';

const {
  getH5ShopInfo,
  getMiniTarbar,
  getMiniconfig,
  getMiniResourceList,
  getClientInfoM,
  getShareInfo,
} = api;

export default modelExtend(model, {
  namespace: 'client',
  state: {
    // 店铺id
    cid: null,

    // 店铺logo
    logo: '',

    // 店铺名字
    name: '',

    // 店铺是否认证（关联第三方小程序)
    authorized: null,

    // 小程序ID
    appId: null,

    // 小程序配置
    miniConfig: {
      navigationLineCount: 3,
      themeColor: '#FF4D4F',
      showTeachingplanJoinCount: 'y',
      articleShowStyle: { templateType: 'tpl_1', showData: 'y' },
    },

    // 权限列表
    miniResourceList: [
      '1611',
      '160201',
      '1313',
      '2710',
    ],

    // 小程序信息
    clientInfoM: null,

    // 分享对话框信息
    shareInfo: null,

    // tabs
    tabPaths: [],
    tabbar: [
      // {
      //   clientId: 'e0e67b6404d3d9f86e6452dc6360926e',
      //   tarbarId: '5209cdad0f2e95cd4313ce557d5acf1b',
      //   pagePath: 'pages/index',
      //   iconClassName: 'course',
      //   iconPath: 'https://qcdn.beautifulreading.com/8c4156680de11d41316f1b830464722f.png',
      //   selectedIconPath: 'https://qcdn.beautifulreading.com/ff7f72dc462b02b50fafa9c85d30d355.png',
      //   text: '课程',
      //   enabled: 'y',
      //   sort: 1,
      //   webUrl: '/index',
      // },
      // {
      //   client_id: 'e0e67b6404d3d9f86e6452dc6360926e',
      //   tarbar_id: '1d1fe9987cdd0dd592680af1061303c5',
      //   pagePath: 'pages/course-info-mine/index',
      //   iconClassName: 'achievement',
      //   iconPath: 'https://qcdn.beautifulreading.com/26440fc4f8cd887a896fabc644a7ca5f.png',
      //   selectedIconPath: 'https://qcdn.beautifulreading.com/eccc0eedb5ee0dca895c72a700101b1e.png',
      //   text: '成绩1',
      //   enabled: 'y',
      //   sort: 2,
      //   webUrl: '/level',
      // },
      // {
      //   client_id: 'e0e67b6404d3d9f86e6452dc6360926e',
      //   tarbar_id: 'a42f4a76428000e7724d5776cf474c59',
      //   pagePath: 'meidu-weapp/packages/tabbar/article/list/index',
      //   iconClassName: 'article',
      //   iconPath: 'https://qcdn.beautifulreading.com/106be41657965a5777423afe99b5f319.png',
      //   selectedIconPath: 'https://qcdn.beautifulreading.com/cd1b3e56c407551a179d93643ba4524d.png',
      //   text: '文章',
      //   enabled: 'y',
      //   sort: 3,
      //   webUrl: '/article',
      // },
      // // {
      // //   client_id: 'e0e67b6404d3d9f86e6452dc6360926e',
      // //   tarbar_id: '77f265ee70a7df755c56dc821cacc3dd',
      // //   pagePath: 'meidu-weapp/packages/tabbar/showcase/index/index',
      // //   iconClassName: 'store',
      // //   iconPath: 'https://qcdn.beautifulreading.com/481abcd6eff92badae40ca87517f95d7.png',
      // //   selectedIconPath: 'https://qcdn.beautifulreading.com/319374bb0700a1660a7b8e014dafade7.png',
      // //   text: '商城',
      // //   enabled: 'y',
      // //   sort: 4,
      // // },
      // {
      //   client_id: 'e0e67b6404d3d9f86e6452dc6360926e',
      //   tarbar_id: '74b41a49593509a715f1629feeb9a995',
      //   pagePath: 'meidu-weapp/packages/tabbar/profile/index',
      //   iconClassName: 'profile',
      //   iconPath: 'https://qcdn.beautifulreading.com/4052a9e2a7b0424650eb65ce66421aa2.png',
      //   selectedIconPath: 'https://qcdn.beautifulreading.com/3c6878e34f54349fe8a1926638ee1b11.png',
      //   text: '我的',
      //   enabled: 'y',
      //   sort: 5,
      //   webUrl: '/mine',
      // },
    ],
  } as IClient,

  reducers: {},

  effects: {
    /**
     * 全局初始化的起点
     */
    * init(_, { select, call, put }) {
      // 加载cookie数据到state
      let cid = yield call(Cookies.get, `${config.storageNamespace}cid`);

      console.log('INIT - client model 1 - init - cid:', cid);

      // 检查cid是否变化
      // TODO: 异步问题，browser model可能还没有初始化
      const {
        locationQuery: { cid: queryCid },
      } = yield select((state) => state.browser);

      console.log('INIT - client model 2 - init - queryCid:', queryCid);

      if (!queryCid && !cid) {
        // TODO: 没有店铺id，跳转某个默认页面
        console.log('INIT - client model 2.1 - init - !queryCid && !cid');
        return;
      }

      let isCidChanged = false;
      if (queryCid && queryCid !== cid) {
        // 换店铺了
        isCidChanged = true;
        cid = queryCid;
        yield call(Cookies.set, `${config.storageNamespace}cid`, queryCid);

        console.log('INIT - client model 2.2 - init - queryCid !== cid');
      }
      // 存cid
      yield put.resolve(actions.updateState({ cid }));

      // 店铺信息加载
      const { head: { code, msg }, data: shopInfo } = yield call(getH5ShopInfo, { cid });
      console.log('INIT - client model 3 - init - loadShopInfo');
      if (code === 200) {
        yield put.resolve(actions.updateState({
          authorized: shopInfo ? shopInfo.authorized : null,
          appId: shopInfo ? shopInfo.appid : null,
          logo: shopInfo.logo,
          name: shopInfo.name,
        }));

        // 初始化用户信息
        yield put(actions.user.init(isCidChanged));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    // 获取底部tabbar
    * getMiniTarbar(_, { call, put }) {
      const { head: { code, msg }, data } = yield call(getMiniTarbar);
      if (code === 200) {
        const tabbar = data.rows
          ? data.rows.map((item) => ({
            clientId: item.client_id,
            tarbar_id: item.tarbar_id,
            pagePath: item.pagePath,
            iconClassName: item.iconClassName,
            iconPath: item.iconPath,
            selectedIconPath: item.selectedIconPath,
            text: item.text,
            enabled: item.enabled,
            sort: item.sort,
            webUrl: item.web_url,
          })) : [];

        let tabPaths = tabbar.filter((i) => !!i.webUrl).map((i) => i.webUrl);
        tabPaths = tabPaths.concat(tabPaths.map((i) => (i.endsWith('/') ? i.slice(0, i.length - 1) : i)));

        yield put(actions.updateState({
          tabbar,
          tabPaths,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * getMiniConfig(_, { call, put }) {
      const { head: { code, msg }, data } = yield call(getMiniconfig);
      if (code === 200) {
        yield put(actions.updateState({
          miniConfig: {
            navigationLineCount: data.navigation_line_count,
            themeColor: data.theme_color,
            showTeachingplanJoinCount: data.show_teachingplan_join_count ? data.show_teachingplan_join_count : 'y',
            articleShowStyle: {
              templateType: data.article_show_style ? data.article_show_style.template_type : 'tpl_1',
              showData: data.article_show_style ? data.article_show_style.show_data : 'n',
            },
          },
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 50.41 获取小程序权限列表 getMiniResourceList
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=1617
     */
    * getMiniResourceList(_, { call, put }) {
      const { head: { code, msg }, data } = yield call(getMiniResourceList);
      if (code === 200) {
        const { rows = [] } = data;

        yield put(actions.updateState({
          miniResourceList: [...rows].map((item) => item.rId),
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 50.37 获取小程序信息 getClientInfo_M
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=1616
     */
    * getClientInfoM(_, { call, put }) {
      const { head: { code, msg }, data } = yield call(getClientInfoM);
      if (code === 200) {
        const { client = {} } = data;

        yield put(actions.updateState({
          clientInfoM: { ...client },
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 50.55 获取分享对话框信息 getShareInfo
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=2517
     */
    * getShareInfo(_, { call, put }) {
      const { head: { code, msg }, data } = yield call(getShareInfo);
      if (code === 200) {
        const result = data;

        yield put(actions.updateState({
          shareInfo: { ...result },
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },
  },

  subscriptions: {
    setup({ dispatch }) {
      // 整个初始化过程的起点，为避免初始化顺序不可控，其他模块的初始化尽量挂在主线的初始化上
      console.log('INIT - client model 0');

      dispatch({ type: 'init' });
    },
  },
});
