import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import actions from 'actions';
// import api from 'api';

// const {
// } = api;

// 媒体播放管理
export default modelExtend(model, {
  namespace: 'media',

  state: {
    playUrl: '',
  },

  reducers: {},

  effects: {
    * mediaPlay({ payload: { url } }, { call, select, put }) {
      yield put(actions.updateState({ playUrl: url }));
    },
  },
});
