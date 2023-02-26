import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import api from 'api';
import actions from 'actions';
// import testState from './testState';

const AUDIO_ICON = require('./images/audioBg.png');

const {
  getOpernsetDetail,
  favoriteOpernset,
  getOpernsetShareImg,
} = api;

export default modelExtend(model, {
  namespace: 'fileSetDetail',

  state: {
    coverList: [],
    title: '',
    desc: {
      desc: '',
    },
    fileList: {},
    nodeList: {
      nodeList: [],
    },
    adList: [],
    mediaList: {
      list: [],
    },
    submitBar: {
      // 分享
      share: {
        // 入口文案
        label: '分享',
      },
    },
    favorites: {
      favoriteFlag: 'n',
    },
  },

  reducers: {},

  effects: {
    * getOpernsetDetail(_, { select, put, call }) {
      const userId = yield select((state) => state.user.userId);
      const clientId = yield select((state) => state.client.cid);
      const opernsetId = yield select((state) => state.browser.locationQuery.opernsetId);

      const { head: { code, msg }, data } = yield call(getOpernsetDetail, {
        user_id: userId,
        client_id: clientId,
        opernset_id: opernsetId,
      });

      if (code === 200) {
        const coverList = data.cover_url ? data.cover_url.map((i: string) => ({
          url: i,
          type: 'image',
        })) : [];
        const desc = {
          desc: data.desc,
        };

        let fileList: any = '';
        const fileBlock = data.moduleinfo_rows
        && data.moduleinfo_rows.find((i: any) => i.type === 15);
        if (fileBlock) {
          fileList = {
            title: fileBlock.name,
            list: fileBlock.opernList.map((i) => ({
              title: i.title,
              image: i.cover_url ? i.cover_url[0] : '',
              showStat: [],
              price: i.price || 0,
              originalPrice: i.original_price || 0,
              opernId: i.opern_id,
            })),
          };
        }

        let nodeList: any = '';
        const nodeBlock = data.moduleinfo_rows
        && data.moduleinfo_rows.find((i: any) => i.type === 8);
        if (nodeBlock) {
          nodeList = {
            title: nodeBlock.name,
            nodeList: [
              {
                node: nodeBlock.mediaList ? nodeBlock.mediaList.map((node) => {
                  const ret : any = {
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
            ],
          };
        }

        let adList: any = '';
        const adBlock = data.moduleinfo_rows
        && data.moduleinfo_rows.find((i: any) => i.type === 5);
        if (adBlock) {
          adList = adBlock.bannerList ? adBlock.bannerList.map((i) => ({
            type: 'image',
            url: i.image,
            jumpUrl: i.url,
          })) : [];
        }

        let mediaList: any = '';
        const mediaBlock = data.moduleinfo_rows
        && data.moduleinfo_rows.find((i: any) => i.type === 14);
        if (mediaBlock) {
          mediaList = {
            title: mediaBlock.name,
            list: (mediaBlock.videos || []).map((i) => ({
              type: 'video',
              image: i.image,
            })).concat((mediaBlock.imgs || []).map((i) => ({
              type: 'image',
              image: i.url,
            }))).concat((mediaBlock.audios || []).map(() => ({
              type: 'audio',
              image: AUDIO_ICON,
            }))),
          };
        }

        let courseList: any = '';
        const courseBlock = data.moduleinfo_rows
        && data.moduleinfo_rows.find((i: any) => i.type === 16);
        if (courseBlock) {
          courseList = {
            title: courseBlock.name,
            list: courseBlock.courseList.map((item) => ({
              title: item.title,
              image: item.cover_url ? item.cover_url[0] : '',
              courseId: item.course_id,
              showStat: [`已学习${item.join_count || 0}`, `作业数${item.post_count || 0}`],
            })),
          };
        }

        let articleList: any = '';
        const articleBlock = data.moduleinfo_rows
        && data.moduleinfo_rows.find((i: any) => i.type === 11);
        if (articleBlock) {
          articleList = {
            title: articleBlock.name,
            list: articleBlock.articleList.map((item) => ({
              title: item.title,
              image: item.cover_url || '',
              articleId: item.article_id,
              articleUrl: item.article_url || '',
              showStat: [`阅读数${item.browseNum || 0}`],
            })),
          };
        }

        yield put(actions.updateState({
          coverList,
          title: data.title,
          desc,
          fileList,
          nodeList,
          adList,
          mediaList,
          courseList,
          articleList,
          favorites: {
            favoriteFlag: data.favorite_flag,
          },
        }));
      } else {
        yield put(actions.toastFail(msg));
        yield put(actions.jumpToExceptionPage({ message: encodeURIComponent(msg) }));
      }
    },

    * collect(_, { select, put, call }) {
      const userId = yield select((state) => state.user.userId);
      const clientId = yield select((state) => state.client.cid);
      const opernsetId = yield select((state) => state.browser.locationQuery.opernsetId);
      const favorites = yield select((state) => state.fileSetDetail.favorites);
      const flag = favorites.favoriteFlag === 'y' ? 'n' : 'y';

      const { head: { code, msg } } = yield call(favoriteOpernset, {
        user_id: userId,
        client_id: clientId,
        opernset_id: opernsetId,
        flag,
      });

      if (code === 200) {
        yield put(actions.updateState({
          favorites: {
            favoriteFlag: flag,
          },
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * share(_, { select, put, call }) {
      const userId = yield select((state) => state.user.userId);
      const clientId = yield select((state) => state.client.cid);
      const opernsetId = yield select((state) => state.browser.locationQuery.opernsetId);

      const { head: { code, msg }, data } = yield call(getOpernsetShareImg, {
        user_id: userId,
        client_id: clientId,
        opernset_id: opernsetId,
        t: Date.now(),
        hcode: 100,
      });

      if (code === 200) {
        yield put(actions.popup.showShareMenu(data.shareImg));
      } else {
        yield put(actions.toastFail(msg));
      }
    },
  },
});
