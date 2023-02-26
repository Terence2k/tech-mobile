import modelExtend from 'dva-model-extend';
import { model, Model, IShare } from '@/utils/model';
import api from 'api';
import actions from 'actions';
import moment from 'moment';
// import testState from './testState';

const {
  getArticleDetail,
  upObject,
  addArticleBrowse,
} = api;

export const namespace = 'articleDetail';
export default modelExtend(model, {
  namespace,

  state: {
    title: '',
    author: '',
    createTime: '',
    viewCount: 0,
    desc: '',
    articleContent: [
      {
        node: [],
      },
    ],
    likeCount: 0,
    postCount: 0,
  },

  reducer: {},

  effects: {
    * addArticleBrowseResult(_, { call, select }) {
      const clientId = yield select((s) => s.client.cid);
      const userId = yield select((s) => s.user.userId);
      const articleId = yield select((s) => s.browser.locationQuery.articleId);

      yield call(addArticleBrowse, {
        client_id: clientId,
        article_id: articleId,
        user_id: userId,
      });
    },
    * getArticleDetail(_, { select, put, call }) {
      const clientId = yield select((s) => s.client.cid);
      const articleId = yield select((s) => s.browser.locationQuery.articleId);

      const { head: { code, msg }, data } = yield call(getArticleDetail, {
        client_id: clientId,
        article_id: articleId,
      });

      if (code === 200) {
        const articleContent = [
          {
            node: data.content && data.content.node
              ? data.content.node.map((node) => {
                const ret: any = {
                  type: node.type,
                  attrs: {},
                };
                if (node.attrs) ret.attrs = node.attrs;
                if (node.html) ret.html = node.html;
                if (node.text) ret.text = node.text;
                if (node.sub_entry) {
                  ret.subEntry = node.sub_entry.map((entry) => ({
                    imageUrl: entry.image_url,
                    width: entry.width,
                    height: entry.height,
                  }));
                }
                return ret;
              }) : [],
          },
        ];

        yield put(actions.updateState({
          articleContent,
          title: data.title,
          author: data.author,
          createTime: data.createTime ? moment(data.createTime).format('YYYY-MM-DD') : '',
          viewCount: data.browseNum,
          desc: data.desc,
          likeCount: data.likeNum || 0,
          postCount: data.share_count || 0,
          likeFlag: data.up_flag || 'n',
          articleDetail: data,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * likeClick(_, { select, put, call }) {
      const objectId = yield select((s) => s.browser.locationQuery.articleId);
      const likeFlag = yield select((s) => s.articleDetail.likeFlag);

      const { head: { code, msg } } = yield call(upObject, {
        object_id: objectId,
        object_type: 300,
        flag: likeFlag === 'y' ? 'n' : 'y',
      });

      if (code === 200) {
        yield put({ type: 'getArticleDetail' });
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * onLoad(_, { all, put }) {
      const types = [
        'getArticleDetail',
        'addArticleBrowseResult',
      ];
      yield put(actions.showLoading('加载中...'));
      yield all(types.map((type) => put.resolve({ type })));
      yield put(actions.hideLoading());
    },

    /**
     * 用户点击右上角转发
     */
    * onShareAppMessage(_, { select }) {
      const articleDetail = yield select((state) => state[namespace].articleDetail);
      const {
        title = '', desc = '', cover_url: coverUrl, cover = '',
      } = articleDetail || {};

      const options: IShare = {
        title,
        desc,
        link: window.location.href,
        imgUrl: coverUrl || cover,
      };

      return options;
    },
  },
} as Model);
