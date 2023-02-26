import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import api from 'api';
import actions from 'actions';

const {
  updateMinaUserInfo,
} = api;

export default modelExtend(model, {
  namespace: 'mineInfoEdit',
  state: {
    userName: '',
  },

  reducers: {
    updateUserName(state, { payload: { userName } }) {
      return {
        ...state,
        userName,
      };
    },
  },

  effects: {
    * updateMinaUserInfo(_, { select, call, put }) {
      const userName = yield select((s) => s.mineInfoEdit.userName);
      if (userName) {
        const { head: { code, msg } } = yield call(updateMinaUserInfo, {
          nickname: userName,
        });

        if (code === 200) {
          yield put(actions.toastSucc('修改成功'));
          yield put({ type: 'user/getUserInfo' });
        } else {
          yield put(actions.toastFail(msg));
        }
      }
    },
  },
});
