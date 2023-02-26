import modelExtend from 'dva-model-extend';
import { AnyAction, Action, Reducer } from 'redux';
import { CallEffectFactory, CallEffect, Put } from 'redux-saga/effects';
import { stringify } from 'qs';
import { TState } from '@/models/types';
import actions from 'actions';
import api from 'api';

interface Payload extends Action {
  payload: { [key: string]: any };
}
// interface Call {
//   (channel: string, params?: { [key: string]: any }): any;
// }
interface Select {
  <A extends { (state: TState): any }>(selector: A): any;
}
interface Reducers {
  [key: string]: Reducer<any, Payload>
}
interface EffectsCommandMap {
  put: Put;
  call: CallEffectFactory<CallEffect>;
  select: Select;
  take: Function;
  cancel: Function;
  [key: string]: any;
}
type Effect = (action: AnyAction, effects: EffectsCommandMap) => any;
type EffectType = 'takeEvery' | 'takeLatest' | 'watcher' | 'throttle';
type EffectWithType = [Effect, { type: EffectType }];
interface EffectsMapObject {
  [key: string]: Effect | EffectWithType;
}
export interface IShare {
  title: string, // 分享标题
  desc?: string, // 分享描述
  link: string, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
  imgUrl: string, // 分享图标
}
export interface Model {
  namespace?: string;
  state?: any;
  reducers?: Reducers;
  effects?: EffectsMapObject;
  subscriptions?: any;
}

const {
  getIconNavigationDetail,
} = api;

export const model: Model = {
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    /**
     * 50.54 获取图标导航详情 getIconNavigationDetail
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=2514
     */
    * getIconNavigationDetailResult(_, { select, call, put }) {
      const { navigationId = '' } = yield select((state) => state.browser.locationQuery);

      if (!navigationId) {
        return;
      }

      yield put.resolve(actions.updateState({ isLoading: true }));
      const { head: { code, msg }, data } = yield call(getIconNavigationDetail, {
        navigation_id: navigationId,
      });

      if (code === 200) {
        const result = { ...data };
        const { object_type_list: objectTypeList = [] } = result;

        const value = [
          { code: -1, label: '全部' },
        ];

        Array.from(new Set(objectTypeList)).forEach((element) => {
          if (element === 314) {
            value.push({ code: 314, label: '综合课' });
          } else if (element === 200) {
            value.push({ code: 200, label: '录播课' });
          } else if (element === 312) {
            value.push({ code: 312, label: '直播' });
          } else if (element === 321) {
            value.push({ code: 321, label: '预约' });
          } else if (element === 311) {
            value.push({ code: 311, label: '打卡' });
          } else if (element === 204) {
            value.push({ code: 204, label: '资料' });
          } else if (element === 216) {
            value.push({ code: 216, label: '实体商品' });
          } else if (element === 208) {
            value.push({ code: 208, label: '考级' });
          } else if (element === 300) {
            value.push({ code: 300, label: '文章' });
          } else if (element === 315) {
            value.push({ code: 315, label: '考试' });
          } else if (element === 335) {
            value.push({ code: 335, label: '活动报名' });
          }
        });

        yield put(actions.updateState({
          isLoading: false,
          IconNavigationDetail: result,
          objectTypes: value,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 用户点击右上角转发
     */
    * onShareAppMessage(_, { select }) {
      const client = yield select((state) => state.client);

      const { logo, shareInfo, cid } = client;

      // 分享 缺省
      const {
        shopDialogShareTitle = '',
        shopDialogShareImage = '',
      } = shareInfo || {};

      const options = {} as IShare;

      // 分享标题
      if (!options.title) {
        options.title = shopDialogShareTitle;
      }

      // 分享描述
      // if (!options.desc) {
      //   options.desc = desc;
      // }

      // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      if (!options.link) {
        const { protocol, hostname, port } = window.location;
        options.link = [
          `${protocol}//`,
          hostname,
          port ? `:${port}` : '',
          `/${GLOBAL_CONFIG.BASE_PATH}/index`,
          `?${stringify({ cid })}`,
        ].join('');
      }

      // 分享图标
      if (!options.imgUrl) {
        options.imgUrl = logo || shopDialogShareImage || '';
      }

      return options;
    },
  },
};

export const pageModel: Model = modelExtend(model, {
  state: {
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      total: 0,
      pageSize: 10,
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      const { list, pagination } = payload;
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      };
    },
  },
});
