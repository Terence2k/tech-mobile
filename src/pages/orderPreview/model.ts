import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import api from 'api';
import actions from 'actions';

const {
  previewOrder,
  myMemberCardList,
  joinCourse,
  joinLiveCourse,
  joinTeachingPlan,
  joinOpern,
  joinDaka,
  joinExampaper,
  joinExam,
  joinMembercard,
} = api;

const IS_DEBUG = false;
const testState = {
  isLoading: false,
  mobileNumber: '13760755888',

  // 订单商品列表
  products: [{
    icon: 'https://qcdn.beautifulreading.com/upload_files/2020/04/09/95383022dce6df61e906b713565d777b.jpeg',
    title: '张晓松蓝调口琴入门',
    desc: '10节课时',
    price: 600.00,
    count: 3,
  }, {
    icon: 'https://qcdn.beautifulreading.com/upload_files/2020/04/09/95383022dce6df61e906b713565d777b.jpeg',
    title: '张晓松蓝调口琴入门',
    desc: '10节课时',
    price: 600.00,
    count: 6,
  }],

  // 商品总价（不计算运费，优惠）
  money: 9999,
  // 商品总价加运费
  price: 9876,
  // 订单总价,实际支付价格
  total: 987125.00,
  // 订单优惠价格
  discount: 0,
  // 运费
  fee: 300,

  // components/productSubmitBar（通用）
  // 注意：mode字段确定menu的主题样式；label为当前menu文案；可添加其它字段供点击回调使用（比如使用会员卡的标识type: 'membercard'）。
  productSubmitBar: {},

  // 备注
  remark: '',

  // 优惠券选择文案
  ticketText: '未使用优惠券',

  // 选择的优惠券id
  userTicketId: '',
};

export default modelExtend(model, {
  namespace: 'orderPreview',

  state: IS_DEBUG ? testState : {
    isLoading: true,
  },
  reducers: {
    updateRemark(state, { payload: { remark } }) {
      return {
        ...state,
        remark,
      };
    },
  },
  effects: {
    /**
     * 重新计算订单预览
     */
    * refreshPreviewData(_, { call, select, put }) {
      const query = yield select((state) => state.browser.locationQuery);
      const productList = JSON.parse(decodeURIComponent(query.product_list));
      const mcuId = yield select((state) => state.orderPreview.mcuId);
      const userTicketId = yield select((state) => state.orderPreview.userTicketId);

      const { head: { code, msg }, data } = yield call(previewOrder, {
        product_info_list: productList.map((product) => ({
          product_id: product.productId,
          param_detail_id: product.productDetailId,
          num: product.num,
        })),
        user_ticket_id: userTicketId,
        mcu_id: mcuId,
      });

      if (code === 200) {
        yield put(actions.updateState({
          // 商品总价（不计算运费，优惠）
          money: data.money,
          // 商品总价加运费
          price: data.price,
          // 订单总价,实际支付价格
          total: data.total,
          // 订单优惠价格
          discount: data.discount,
          // 运费
          fee: data.fee,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },
    /**
     * 加载当前订单预览信息
     */
    * getPreviewData(_, { call, select, put }) {
      if (IS_DEBUG) {
        return;
      }

      yield put.resolve(actions.updateState({ isLoading: true }));

      const query = yield select((state) => state.browser.locationQuery);
      if (query.is_back) {
        // 从微信回调回来的情况，跳redirect页面
        yield put(actions.browser.jumpToRedirectPage());
        return;
      }

      if (!query.product_list) {
        yield put(actions.toastFail('参数错误'));
        return;
      }
      const productList = JSON.parse(decodeURIComponent(query.product_list));

      const { head: { code, msg }, data } = yield call(previewOrder, {
        product_info_list: productList.map((product) => ({
          product_id: product.productId,
          param_detail_id: product.productDetailId,
          num: product.num,
        })),
        user_ticket_id: query.user_ticket_id,
        mcu_id: query.mcu_id,
      });

      if (code === 200) {
        const mobileNumber = yield select((state) => state.user.mobileNumber);
        yield put(actions.updateState({
          isLoading: false,
          mobileNumber,

          // 订单商品列表
          products: data.products.map((product) => ({
            icon: product.cover_url,
            title: product.product_name,
            price: product.price,
            count: product.num,
            productType: product.productType,
            linkId: product.link_id,
          })),
          // 商品总价（不计算运费，优惠）
          money: data.money,
          // 商品总价加运费
          price: data.price,
          // 订单总价,实际支付价格
          total: data.total,
          // 订单优惠价格
          discount: data.discount,
          // 运费
          fee: data.fee,
          // 备注
          remark: '',
          // 优惠券ID
          userTicketId: '',
          // 优惠券描述
          ticketText: query.user_ticket_id ? '' : '未使用优惠券',
          // 会员卡ID
          mcuId: query.mcu_id,
          // 会员卡描述
          mcuText: '',
        }));

        // 计算优惠券显示
        if (query.user_ticket_id) {
          yield put.resolve(actions.ticket.loadAvailableTicketList(productList,
            false, query.user_ticket_id));

          yield put({ type: 'selectUserTicket', payload: { userTicketId: query.user_ticket_id } });
        }
        // 计算会员卡显示
        if (query.mcu_id) {
          const cid = select((state) => state.client.cid);
          const { head: { code: codeM, msg: msgM }, data: dataM } = yield call(
            myMemberCardList, {
              client_id: cid,
              status: 'valid',
            },
          );
          if (codeM === 200) {
            const card = dataM.rows.find((c) => c.mcu_id === query.mcu_id);
            yield put(actions.updateState({ mcuText: card ? card.title : '' }));
          } else {
            yield put(actions.toastFail(msgM));
          }
        }
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * selectUserTicket({ payload: { userTicketId } }, { select, put }) {
      const ticketList = yield select((state) => state.ticket.availableTicketInfo.list);
      const ticketInfo = ticketList.find((t) => t.userTicketId === userTicketId);
      yield put.resolve(actions.updateState({
        userTicketId,
        ticketText: `${ticketInfo.desc.useLimit} ${ticketInfo.desc.discount}`,
      }));
      yield put({ type: 'refreshPreviewData' });
    },

    /**
     * 点击支付按钮的总入口
     */
    * pay(action, { select, put }) {
      // 0-普通，
      // 1-单品，
      // 2-专栏，
      // 4-在线课程，
      // 5-曲谱，
      // 6-杂志，
      // 7-考级等级
      // 8-打卡
      // 9-直播课
      // 10-会员卡
      // 11-考试
      // 12-方案
      // 13-预约规则
      // 14-报名表
      // join
      const remark = yield select((state) => state.orderPreview.remark);
      const productList = yield select((state) => state.orderPreview.products);
      const mcuId = yield select((state) => state.orderPreview.mcuId);
      const total = yield select((state) => state.orderPreview.total);
      // 如果没有选择会员卡，才带上用户优惠券
      let userTicketId = '';
      if (!mcuId) {
        userTicketId = yield select((state) => state.orderPreview.userTicketId);
      }
      const mobileNumber = yield select((state) => state.orderPreview.mobileNumber);
      const product = productList[0];
      console.log('PRODUCT', product);
      if (product.productType === 4) {
        // 在线课程
        const courseId = product.linkId;
        yield put(actions.order.createOrder({
          orderInfo: {
            mobileNumber,
            mcuId,
            total,
            userTicketId,
            remark,
            joinFunc: joinCourse,
            extraParams: { course_id: courseId },
          },
        }));
      } else if (product.productType === 9) {
        // 直播课程
        const livecourseId = product.linkId;
        yield put(actions.order.createOrder({
          orderInfo: {
            mobileNumber,
            mcuId,
            total,
            userTicketId,
            remark,
            joinFunc: joinLiveCourse,
            extraParams: { livecourse_id: livecourseId },
          },
        }));
      } else if (product.productType === 12) {
        // 超级大纲
        const planId = product.linkId;
        yield put(actions.order.createOrder({
          orderInfo: {
            mobileNumber,
            mcuId,
            total,
            userTicketId,
            remark,
            joinFunc: joinTeachingPlan,
            extraParams: { plan_id: planId },
          },
        }));
      } else if (product.productType === 5) {
        // 课程资料
        const opernId = product.linkId;
        yield put(actions.order.createOrder({
          orderInfo: {
            mobileNumber,
            mcuId,
            total,
            userTicketId,
            remark,
            joinFunc: joinOpern,
            extraParams: { opern_id: opernId },
          },
        }));
      } else if (product.productType === 8) {
        // 打卡
        const subjectId = product.linkId;
        yield put(actions.order.createOrder({
          orderInfo: {
            mobileNumber,
            mcuId,
            total,
            userTicketId,
            remark,
            joinFunc: joinDaka,
            extraParams: { subject_id: subjectId },
          },
        }));
      } else if (product.productType === 11) {
        // 考试
        const paperId = product.linkId;
        yield put(actions.order.createOrder({
          orderInfo: {
            mobileNumber,
            mcuId,
            total,
            userTicketId,
            remark,
            joinFunc: joinExampaper,
            extraParams: { paper_id: paperId },
          },
        }));
      } else if (product.productType === 7) {
        // 考级
        const levelId = product.linkId;
        yield put(actions.order.createOrder({
          orderInfo: {
            mobileNumber,
            mcuId,
            total,
            userTicketId,
            remark,
            joinFunc: joinExam,
            extraParams: { level_id: levelId },
          },
        }));
      } else if (product.productType === 10) {
        // 会员卡
        const memberCardId = product.linkId;
        yield put(actions.order.createOrder({
          orderInfo: {
            mobileNumber,
            mcuId,
            total,
            userTicketId,
            remark,
            joinFunc: joinMembercard,
            extraParams: { membercard_id: memberCardId },
          },
        }));
      }
    },
  },
});
