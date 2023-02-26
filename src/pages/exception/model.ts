import modelExtend from 'dva-model-extend';
import actions from 'actions';
import { model } from 'utils/model';

export const namespace = 'exception';

// const isDevelopment = process.env.NODE_ENV === 'development';

const IS_DEBUG = false;
const testState = {
  mssage: '',
};

export default modelExtend(model, {
  namespace,

  state: IS_DEBUG ? testState : { isLoading: true },

  reducers: {

  },

  effects: {

  },

  subscriptions: {
    setup({ dispatch, history }) {
      const { location: { query: { message = '' } } } = history;

      dispatch(actions.updateState({ message: decodeURIComponent(message) }));
    },
  },
});
