import modelExtend from 'dva-model-extend';
import moment from 'moment';
import { model } from 'utils/model';
import actions from 'actions';
import api from 'api';
import { stringify } from 'qs';

// import { history, router } from 'umi';
// import { parse, stringify } from 'qs';
// import Cookies from 'js-cookie';
// import config from 'utils/config';

// const { pathToRegexp } = require('path-to-regexp');

const {
  getCatalogObjectList,
} = api;

// const isDevelopment = process.env.NODE_ENV === 'development';

export const namespace = 'catalog';

const IS_DEBUG = false;
const testState = {
  objectTypes: [
    { code: 314, label: '综合课' },
    { code: 200, label: '录播课' },
  ],
  list: [{
    catalogObjectId: 'a88a24ac0b4f1fcfbc03790b8836bf1a',
    clientId: 'e0e67b6404d3d9f86e6452dc6360926e',
    objectType: 315,
    objectId: 'ef7135482e8a4f83b6edc098344e8242',
    detailInfo: {
      objectType: 315,
      objectId: 'ef7135482e8a4f83b6edc098344e8242',
      title: "~！@#￥%……&*（）——/*-【[]\\{}';./,】+",
      price: 0,
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/22/85ed8e3036ac72b2f76720030e025c9b.png',
      productStatus: 1,
      miniPath: '/packages/signupPage/index?apply_form_id=ef7135482e8a4f83b6edc098344e8242',
      objectTitle: '活动报名',
      jumpInfo: {},
    },
  }, {
    catalogObjectId: '00a392ebb9914babd76a5240b45b1153',
    clientId: 'e0e67b6404d3d9f86e6452dc6360926e',
    objectType: 216,
    objectId: '9f26f7b3ec574ffa91825450d45ca361',
    detailInfo: {
      objectType: 216,
      objectId: '9f26f7b3ec574ffa91825450d45ca361',
      title: '实体',
      price: 0.01,
      originalPrice: 0.11,
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/22/85ed8e3036ac72b2f76720030e025c9b.png',
      productStatus: 1,
      miniPath: '/packages/signupPage/index?apply_form_id=9f26f7b3ec574ffa91825450d45ca361',
      objectTitle: '活动报名',
      jumpInfo: {},
    },
  }],
};

export default modelExtend(model, {
  namespace,

  state: IS_DEBUG ? testState : { isLoading: true },

  reducers: {},

  effects: {
    * updateCurrenttype({ payload: { currentType: { code = -1, label = '全部' } } }, { put }) {
      yield put.resolve(actions.updateState({ currentType: { code, label } }));
      yield put({ type: 'getCatalogObjectListResult' });
    },
    /**
     * 50.53 获取分类内容列表 getCatalogObjectList
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=2507
     */
    * getCatalogObjectListResult({ payload = { skip: 0, limit: 10 } }, {
      select, call, all, put,
    }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const catalogState = yield select((state) => state[namespace]);

      const { catalogId = '' } = yield select((state) => state.browser.locationQuery);

      const options: any = {
        client_id: cid,
        user_id: userId,
        catalog_id: catalogId,
        skip: payload.skip,
        limit: payload.limit,
      };

      if (catalogState.currentType && catalogState.currentType.code !== -1) {
        options.object_type = catalogState.currentType.code;
      }

      const { head: { code, msg }, data } = yield call(getCatalogObjectList, options);

      if (code === 200) {
        const result = { ...data };
        const rows = result.rows || [];
        const catalogCount = result.count || 0;

        let catalogList = catalogState.catalogList || [];
        catalogList = payload.skip === 0 ? [] : catalogList;
        catalogList = catalogList.concat(rows.map((item) => {
          // { code: '1602', label: '录播课程', value: 200, productType: 4, },
          // { code: '1611', label: '直播', value: 312, productType: 9, },
          // { code: '1612', label: '方案', value: 314, productType: 12, },
          // { code: '1613', label: '预约', value: 321, },
          // { code: '3001', label: '打卡主题', value: 311, productType: 8, },
          // { code: '1610', label: '课件资料', value: 204, productType: 5, },
          // { code: '1201', label: '实体商品', value: 216, productType: 0, },
          // { code: '2701', label: '考级', value: 208, },
          // { code: '1101', label: '文章', value: 300, },
          // { code: '1310', label: '会员卡', value: 313, productType: 10, },

          const jumpInfo: any = {};
          switch (item.object_type) {
            case 200: {
              jumpInfo.webUrl = `/course/product?${stringify({ course_id: item.object_id })}`;
              break;
            }
            case 312: {
              jumpInfo.webUrl = `/course/live?${stringify({ livecourse_id: item.object_id })}`;
              break;
            }
            case 314: {
              jumpInfo.webUrl = `/teachingPlan?${stringify({ plan_id: item.object_id })}`;
              break;
            }
            case 311: {
              jumpInfo.webUrl = `/daka/product?${stringify({ subject_id: item.object_id })}`;
              break;
            }
            case 204: {
              jumpInfo.webUrl = `/file/fileDetail?${stringify({ opern_id: item.object_id })}`;
              break;
            }
            case 216: {
              jumpInfo.type = 'product_detail';
              jumpInfo.objectIds = {
                product_id: item.object_id,
              };
              break;
            }
            case 313: {
              jumpInfo.webUrl = `/memberCard/detail?${stringify({ membercard_id: item.object_id })}`;
              break;
            }

            case 321: {
              jumpInfo.webUrl = `/course/reservation?${stringify({ reservation_id: item.object_id })}`;
              break;
            }

            case 208: {
              jumpInfo.webUrl = `/themeDetail?${stringify({ subject_id: item.object_id })}`;
              break;
            }

            case 300: {
              jumpInfo.webUrl = `/course/live?${stringify({ article_id: item.object_id })}`;
              break;
            }

            case 315: {
              jumpInfo.webUrl = `/exam/product?${stringify({ paper_id: item.object_id })}`;
              break;
            }

            case 335: {
              jumpInfo.type = 'applyform_detail';
              jumpInfo.objectIds = {
                apply_form_id: item.object_id,
              };
              break;
            }

            default:
              break;
          }

          const i: any = {};
          i.catalogObjectId = item.catalog_object_id;
          i.clientId = item.client_id;
          i.objectType = item.object_type;
          i.objectId = item.object_id;

          const detailInfo = item.detail_info || {};
          i.detailInfo = {
            objectType: detailInfo.object_type,
            objectId: detailInfo.object_id,
            title: detailInfo.title,
            subContent: detailInfo.sub_content,
            price: detailInfo.price,
            originalPrice: detailInfo.original_price,
            duration: detailInfo.duration,
            image: detailInfo.image,
            productStatus: detailInfo.product_status,
            miniPath: detailInfo.mini_path,
            objectTitle: detailInfo.object_title,
            questionCount: detailInfo.question_count,
            endTime: detailInfo.end_time ? moment(detailInfo.end_time).format('YYYY-MM-DD HH:mm') : '',
            jumpInfo,
          };

          return i;
        }));

        yield put(actions.updateState({
          isLoading: false,
          catalogList,
          catalogCount,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 页面加载
     */
    * onLoad(_, { all, put, select }) {
      if (IS_DEBUG) {
        return;
      }

      const isJustPopState = yield select((s) => (s.browser.isJustPopState));
      const { isLoading } = yield select((state) => state[namespace]);
      if (isJustPopState && !isLoading) {
        return;
      }

      const types = [
        'getIconNavigationDetailResult',
        'getCatalogObjectListResult',
      ];
      yield put(actions.showLoading('加载中...'));
      yield all(types.map((type) => put({ type })));
      yield put(actions.hideLoading());
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    * onReachBottom(_, { select, put }) {
      if (IS_DEBUG) {
        return;
      }

      const {
        isLoading,
        catalogList = [],
        catalogCount = 0,
      } = yield select((state) => state[namespace]);

      if (isLoading || catalogList.length >= catalogCount) return;

      yield put(actions.showLoading('加载中...'));
      yield put({ type: 'getCatalogObjectListResult', payload: { skip: catalogList.length, limit: 10 } });
      yield put(actions.hideLoading());
    },
  },
});
