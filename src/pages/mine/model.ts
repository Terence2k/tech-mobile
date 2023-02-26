import modelExtend from 'dva-model-extend';
import actions from 'actions';
import api from 'api';
import { model } from 'utils/model';

export const namespace = 'mine';

const {
  getMyMembercardInfo,
  getMineMenu,
} = api;

const IS_DEBUG = true;
const testState = {
  myMembercardInfo: {
    showMembercard: {

    },
    myMembercard: [],
  },
  panels: [],
};

export default modelExtend(model, {
  namespace,

  state: IS_DEBUG ? testState : { isLoading: true },

  effects: {
    /**
     * 76.8 获取我的会员卡信息 getMyMembercardInfo
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=2096
     */
    * getMyMembercardInfoResult(_, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const cid = yield select((state) => state.client.cid);

      const { head: { code, msg }, data } = yield call(getMyMembercardInfo, {
        client_id: cid,
      });
      if (code === 200) {
        const result = { ...data };
        const myMembercard = result.my_membercard ? result.my_membercard.map((item) => {
          const m: any = {};
          m.title = item.title;
          m.validDays = item.valid_days;
          m.expireTime = item.expire_time;

          return m;
        }) : [];
        const showMembercard = result.show_membercard ? {
          title: result.show_membercard.title,
          validDays: result.show_membercard.valid_days,
          expireTime: result.show_membercard.expire_time,
        } : {};

        const myMembercardInfo: any = { myMembercard, showMembercard };

        yield put(actions.updateState({ isLoading: false, myMembercardInfo }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 50.57 获取我的菜单 getMineMenu
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=2669
     */
    * getMineMenuResult(_, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const { head: { code, msg }, data } = yield call(getMineMenu, {});
      if (code === 200) {
        const result = { ...data };

        const webUrlFormat = (url) => (url.startsWith('/') ? url : `/${url}`);

        const panels = result.rows ? result.rows.map((item) => ({
          title: item.title,
          list: item.navigators ? item.navigators.map((i) => ({
            name: i.name,
            resourceId: i.resourceId || '',
            type: i.type,
            url: i.url || '',
            icon: i.icon,
            jumpInfo: {
              webUrl: i.web_url ? webUrlFormat(i.web_url) : '',
              type: (!i.web_url && !i.path_type) ? 'index' : i.path_type, // 默认跳小程序首页
              objectIds: {},
            },
            count: i.new_count,
          })) : [],
        })) : [];

        yield put(actions.updateState({ isLoading: false, panels }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 页面加载
     */
    * onLoad(_, { all, put }) {
      // if (IS_DEBUG) {
      //   return;
      // }

      const types = [
        'getMyMembercardInfoResult',
        'getMineMenuResult',
      ];
      yield put(actions.showLoading('加载中...'));
      yield all(types.map((type) => put.resolve({ type })));
      yield put(actions.hideLoading());
    },
  },
});
