import modelExtend from 'dva-model-extend';
import { model, Model, IShare } from '@/utils/model';
import api from 'api';
import actions from 'actions';
import moment from 'moment';
import { nodeParser } from '@/components/product/productMediaList';
import testState from './testState';

const {
  getTeachingPlanDetail,
  getItemList,
  joinTeachingPlan,
} = api;

export default modelExtend(model, {
  namespace: 'teachingPlan',

  state: testState,

  reducers: {
    onOpenChange(state, { payload: { activeKey } }) {
      return {
        ...state,
        activeKey,
      };
    },
    onTabChange(state, { payload: { page } }) {
      return {
        ...state,
        page,
      };
    },
  },

  effects: {
    * getTeachingPlanDetail(_, { select, put, call }) {
      const planId = yield select((s) => s.browser.locationQuery.plan_id);

      const { head: { code, msg }, data } = yield call(getTeachingPlanDetail, {
        plan_id: planId,
      });
      if (code === 200) {
        const coverList = data.cover_list ? data.cover_list.map((i) => ({
          type: i.type,
          url: i.url,
        })) : [];
        const timeText = data.start_time && data.end_time ? `${moment(data.start_time).format('MM-DD')}~${moment(data.end_time).format('MM-DD')}` : '';
        const teachers = {
          name: '授课老师',
          list: data.teacher_list.map((i) => ({
            headimgurl: i.headimgurl,
            nickname: i.nickname,
          })),
        };
        const mediaList = data.memo && data.memo.node ? [{
          node: data.memo.node.map(nodeParser),
        }] : [{ node: [] }];
        // 优惠券
        const productTicketList = {
          name: '',
          list: data.ticketList ? data.ticketList.map((ticket) => ({
            ticketId: ticket.ticket_id,
            name: ticket.name,
            useLimit: ticket.use_limit,
            type: ticket.ticket_type,
            discount: ticket.discount,
          })) : [],
        };
        const joinPlan = () => ({
          type: 'teachingPlan/joinPlan',
        });
        const submitBar = {
          share: {
            // 入口文案
            label: '分享',
          },
          menus: data.join_flag === 'y' ? [] : [
            {
              // 正价
              mode: 'custom',
              background: '#F5222D',
              type: 'default',
              label: '立即报名',
              handler: joinPlan(),
            },
          ],
        };

        yield put.resolve(actions.updateState({
          joinFlag: data.join_flag,
          productId: data.product_id,
          coverList,
          title: data.title,
          timeText,
          itemCount: data.item_count || 0,
          studyCount: data.join_count || 0,
          price: {
            price: data.price || 0,
            originalPrice: data.original_price || 0,
            free: data.price === 0,
          },
          featuresList: data.feature_list || [],
          sellPoints: data.selling_points || [],
          teachers,
          mediaList,
          productTicketList,
          submitBar,
          teachingPlanDetail: data,
        }));
      } else {
        yield put(actions.toastFail(msg));
        yield put(actions.jumpToExceptionPage({ message: encodeURIComponent(msg) }));
      }
    },

    * getItemList(_, { select, put, call }) {
      const planId = yield select((s) => s.browser.locationQuery.plan_id);
      // const joinFlag = yield select((s) => s.teachingPlan.joinFlag);
      const { head: { code, msg }, data } = yield call(getItemList, {
        plan_id: planId,
      });
      if (code === 200) {
        const itemList = data.rows || [];
        const activeKey = [data.rows[0] && data.rows[0].item_id];

        yield put(actions.updateState({
          itemList: itemList.map((item) => ({
            ...item,
            content_list: item.content_list.map((content) => ({
              ...content,
              plan_id: planId,
            })),
          })),
          activeKey,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * onLoad(_, { put }) {
      yield put(actions.showLoading());
      yield put.resolve({ type: 'getTeachingPlanDetail' });
      yield put({ type: 'getItemList' });
      yield put(actions.hideLoading());
    },

    /**
     * 用户点击右上角转发
     */
    * onShareAppMessage(_, { select }) {
      const teachingPlanDetail = yield select((state) => state.teachingPlan.teachingPlanDetail);
      const { title = '', cover_list: coverList } = teachingPlanDetail || {};
      let imgUrl = coverList ? coverList.filter((item) => item.type === 'image').map((item) => item.url) : '';
      imgUrl = imgUrl.length > 0 ? imgUrl[0] : '';

      const options: IShare = {
        title,
        link: window.location.href,
        imgUrl,
      };

      return options;
    },

    * joinPlan(_, { put, select, call }) {
      const planId = yield select((s) => s.browser.locationQuery.plan_id);
      const mobileNumber = yield select((s) => s.user.mobileNumber);
      const { price: { price = 0 }, productId } = yield select((s) => s.teachingPlan);
      const redirect = yield select((s) => s.browser.redirectStrToCurrentPage);

      if (!price) {
        const { head: { code, msg }, data } = yield call(joinTeachingPlan, {
          plan_id: planId,
          mobile_number: mobileNumber,
        });

        if (code === 200) {
          if (data.status !== 4) {
            // 需要支付，下单方式变更，刷新页面
            yield put(actions.toastFail('获取方式已变更，请重试'));
            yield put({ type: 'onLoad' });
          } else {
            // 加入成功, 刷新页面
            yield put(actions.toastSucc('报名成功'));
            yield put({ type: 'onLoad' });
          }
        } else {
          yield put(actions.toastFail(msg));
        }
      } else {
        yield put(actions.jumpToPage('/orderPreview', {
          product_list: JSON.stringify([{
            productId,
            productDetailId: '',
            num: 1,
          }]),
          redirect,
        }));
      }
    },
  },
} as Model);
