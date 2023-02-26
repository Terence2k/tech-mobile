import modelExtend from 'dva-model-extend';
import { model, Model, IShare } from '@/utils/model';
import { copyToClip } from 'utils/utils';
import api from 'api';
import productFunc from 'common/product';
import actions from 'actions';
import { nodeParser } from '@/components/product/productMediaList';
// import testState from './testState';
/**
 * 获取状态，
 * 1. 已加入且离开始时间超过一个小时;
 * 2. 已结束且有回看;
 * 3. 已结束;
 * 4. 已加入不超过一小时且结束时间不超过一小时;
 * 5. 未加入且非会员免费;
 * 6. 未加入且会员免费;
 * 7. 未加入需要密码;
 * 8. 未加入且有回看且已结束;
 */
import getStatus from './getStatus';

const {
  getLivecourseDetail,
  getLiveCourseShareImg,
  favoriteLiveCourse,
  joinLiveCourse,
  getPcLiveUrl,
} = api;

// 免费加入
const freeJoin = (mcuId = '', planId = '') => ({
  type: 'liveDetail/freeJoin',
  payload: {
    mcuId,
    planId,
  },
});

// 操作弹窗
const changePopup = (popupVisible) => ({
  type: 'liveDetail/changePopup',
  payload: {
    popupVisible,
  },
});

// 复制
const copyFunc = (content, message) => ({
  type: 'liveDetail/copyFunc',
  payload: {
    content,
    message,
  },
});

// 跳转
const jumpToPage = (payload) => ({
  type: 'liveDetail/jumpToPage',
  payload,
});

function getLiveMenus(detail, redirect, planId) {
  const statusObj = getStatus(detail);
  switch (statusObj.type) {
    case 1:
      return [
        {
          mode: 'blue',
          label: '未到开课时间',
          handler: changePopup(true),
        },
      ];
    case 2:
      return [
        {
          mode: 'blue',
          label: '进入回看',
          jumpInfo: {
            type: 'toLiveroom',
            objectIds: {
              livecourse_id: detail.livecourse_id,
              live_type: detail.type,
              live_id: detail.live_id,
            },
          },
        },
      ];
    case 3:
      // 分直播类型，给不同处理
      if (detail.type === 'article') {
        return [
          // 图文直播
          {
            mode: 'blue',
            label: '进入直播间',
            handler: null,
            jumpInfo: {
              type: 'toLiveroom',
              objectIds: {
                livecourse_id: detail.livecourse_id,
                live_type: detail.type,
                live_id: detail.live_id,
              },
            },
          },
        ];
      }
      return [
        // 无回看
        {
          mode: 'custom',
          background: '#DDD',
          label: '直播已结束',
          handler: null,
        },
      ];
    case 4:
      // 分直播类型，给不同处理
      if (detail.type === 'interaction') {
        // 互动直播+屏幕共享
        return [
          {
            mode: 'blue',
            label: '进入直播间',
            handler: changePopup(true),
          },
        ];
      }
      // 图文直播+视频直播
      return [
        {
          mode: 'blue',
          label: '进入直播间',
          handler: null,
          jumpInfo: {
            type: 'toLiveroom',
            objectIds: {
              livecourse_id: detail.livecourse_id,
              live_type: detail.type,
              live_id: detail.live_id,
            },
          },
        },
      ];
    case 5:
      if (planId) {
        // 通过方案加入
        return [
          {
            mode: 'blue',
            label: '免费获取',
            handler: freeJoin('', planId),
          },
        ];
      }
      return [
        {
          mode: 'blue',
          label: '免费获取',
          handler: freeJoin(),
        },
      ];
    case 6:
      if (planId) {
        // 通过方案加入
        return [
          {
            mode: 'blue',
            label: '免费获取',
            handler: freeJoin('', planId),
          },
        ];
      }
      return [
        {
          label: '会员免费看',
          mode: 'black',
          handler: freeJoin(statusObj.payload.mcu_id),
        },
      ];
    case 7:
      if (planId) {
        // 通过方案加入
        return [
          {
            mode: 'blue',
            label: '免费获取',
            handler: freeJoin('', planId),
          },
        ];
      }
      return [
        {
          label: '输入密码',
          mode: 'blue',
          handler: 'showPassword',
        },
      ];
    case 8: {
      return [
        {
          mode: 'custom',
          background: '#dddddd',
          label: '已结束',
          handler: () => { },
        },
      ];
    }
    default:
      if (planId) {
        // 通过方案加入
        return [
          {
            mode: 'blue',
            label: '免费获取',
            handler: freeJoin('', planId),
          },
        ];
      }
      return productFunc.getDefaultMenusByProductDetail(detail, redirect);
  }
}

export default modelExtend(model, {
  namespace: 'liveDetail',

  state: {
    isLoading: false,
    coverList: [],
    title: '',
    liveStatus: {},
    livePrice: {
      price: 0,
      originalPrice: 0,
    },
    countStat: {
      list: [],
    },
    liveDesc: {
      desc: '',
    },
    teachers: {
      name: '',
      list: [],
    },
    fileList: [],
    tabArr: [
      { title: '课程内容' },
      { title: '课程任务' },
    ],
    activeTab: 0,
    liveMediaList: [
      {
        node: [],
      },
    ],
    homeworkList: [],
    liveSubmitBar: {
      menus: [],
    },
    liveFavorites: {
      favoriteFlag: 'n',
    },
    liveRestTime: 0,
    popupVisible: false,
    popupData: {
      data: {},
      operations: [],
    },
    productTicketListData: {
      name: '',
      list: [],
    },
    password: '',
    passwordShow: false,
  },

  reducers: {
    onTabChange(state, { payload: { activeTab } }) {
      return {
        ...state,
        activeTab,
      };
    },
    setPopupVisible(state, { payload: { popupVisible } }) {
      return {
        ...state,
        popupVisible,
      };
    },
    setPasswordShow(state, { payload: { passwordShow } }) {
      return {
        ...state,
        passwordShow,
      };
    },
    setPassword(state, { payload: { password } }) {
      return {
        ...state,
        password,
      };
    },
  },

  effects: {
    // 获取直播详情
    * getLivecourseDetail(action, { select, call, put }) {
      yield put(actions.showLoading('加载中...'));

      const livecourseId = yield select((state) => state.browser.locationQuery.livecourse_id);

      const planId = yield select((state) => state.browser.locationQuery.plan_id);
      const params: any = {
        livecourse_id: livecourseId,
      };
      if (planId) {
        params.plan_id = planId;
      }
      const { head: { code, msg }, data } = yield call(getLivecourseDetail, params);
      if (code === 200) {
        // 封面
        const coverList = data.cover_list ? data.cover_list.map((i) => ({
          type: i.type,
          url: i.url,
        })) : [];
        // 直播标题
        const { title } = data;
        // 直播状态
        const liveStatus = {
          // eslint-disable-next-line no-nested-ternary
          text: data.live_status === 'wait' ? '未开始' : (data.live_status === 'doing' ? '直播中' : '已结束'),
          effect: 'custom',
          value: data.live_status,
          style: {
            // eslint-disable-next-line no-nested-ternary
            background: data.live_status === 'wait' ? '#FFA940' : (data.live_status === 'doing' ? '#0F8FFF' : '#BFBFBF'),
            color: '#FFF',
            marginLeft: '15px',
          },
        };
        // components/productPrice（通用）
        const livePrice = {
          free: data.price_type === 'free' || data.price === 0,
          price: data.price || 0,
          originalPrice: data.original_price || 0,
        };
        // components/countStat 统计数据（通用）
        const countStat = {
          list: (data.show_stat_flag === 'y') ? [`已报名 ${data.join_count}`] : [],
        };
        // 直播简介
        const liveDesc = {
          desc: data.desc || '',
        };
        // 直播授课老师
        const teachers = {
          name: '授课老师',
          list: data.teacher_list ? data.teacher_list.map((teacher) => ({
            headimgurl: teacher.headimgurl,
            nickname: teacher.nickname,
            mainTeacher: teacher.main_teacher,
            intro: teacher.intro,
          })) : [],
        };
        // 资料列表
        const fileList = data.filelist ? data.filelist.map((file) => ({
          title: file.title || file.file_name,
          extension: file.extension,
          downloadFlag: file.download_flag || 'n',
          url: file.url,
        })) : [];
        // 富文本内容
        const liveMediaList = data.memo && data.memo.node ? [{
          node: data.memo.node.map(nodeParser),
        }] : [{ node: [] }];
        // 作业列表
        const homeworkList = data.exampaperSetList ? data.exampaperSetList.map((homework) => ({
          title: homework.title,
          paperId: homework.paper_id,
          questionCount: homework.question_count || 0,
          handinCount: homework.handin_count || 0,
          status: homework.status,
          lastDetailId: homework.last_detail_id,
        })) : [];
        // 优惠券
        const productTicketListData = {
          name: '',
          list: data.ticketList ? data.ticketList.map((ticket) => ({
            ticketId: ticket.ticket_id,
            name: ticket.name,
            useLimit: ticket.use_limit,
            type: ticket.ticket_type,
            discount: ticket.discount,
          })) : [],
        };
        // 当前页面链接，生成的重定向信息
        const redirectStrToCurrentPage = yield select(
          (state) => state.browser.redirectStrToCurrentPage,
        );

        // 底部栏数据
        const liveSubmitBar = {
          // 分享
          share: {
            // 入口文案
            label: '分享',
          },
          // 提交订单栏
          menus: getLiveMenus(data, redirectStrToCurrentPage, planId),
        };

        // 弹窗内容
        let popupData: any = {};
        const { type } = getStatus(data) || {};
        if (type === 1) {
          popupData = {
            data: {
              title: '未到开课时间',
              content: '未到开课时间，可以去全部直播课程列表，了解更多课程。',
            },
            operations: [
              {
                text: '取消',
                func: changePopup(false),
              },
              {
                text: '去看看',
                style: {
                  color: '#409EFF',
                  fontWeight: '600',
                },
                func: jumpToPage({ path: '/course/live/list' }),
              },
            ],
          };
        } else if (type === 4) {
          const userId = yield select((state) => state.user.userId);
          const isTeacher = data.teacher_list.some((e) => e.user_id === userId);

          const { head: { code: urlCode, msg: urlMsg }, data: urlData } = yield call(getPcLiveUrl, {
            livecourse_id: livecourseId,
          });
          if (urlCode === 200) {
            if (isTeacher) {
              popupData = {
                data: {
                  title: '进入直播间',
                  content: `从电脑浏览器打开链接${urlData.pc_meiyue_url}登录进入直播间`,
                },
                operations: [
                  {
                    text: '复制链接',
                    style: {
                      color: '#409EFF',
                      fontWeight: '600',
                    },
                    func: copyFunc(urlData.pc_meiyue_url, null),
                  },
                ],
              };
            } else {
              popupData = {
                data: {
                  title: '进入直播间',
                  content: `<p>复制观看链接从电脑浏览器打开，输入观看码可在电脑观看。</p><p>观看链接：${urlData.pc_live_login_url}</p><p>观看码：${urlData.logincode}</p>`,
                },
                operations: [
                  {
                    text: '复制链接',
                    style: {
                      color: '#409EFF',
                      fontWeight: '600',
                    },
                    func: copyFunc(urlData.pc_live_login_url, null),
                  },
                ],
              };
              if (data.enable_mobile === 'y') {
                popupData.operations.unshift({
                  text: '手机观看',
                  func: changePopup(false),
                  jumpInfo: {
                    type: 'toLiveroom',
                    objectIds: {
                      livecourse_id: data.livecourse_id,
                      live_type: data.type,
                      live_id: data.live_id,
                    },
                  },
                });
              }
            }
          } else {
            yield put(actions.toastFail(urlMsg));
          }
        }

        yield put(actions.updateState({
          coverList,
          title,
          liveStatus,
          livePrice,
          countStat,
          liveDesc,
          teachers,
          fileList,
          liveMediaList,
          homeworkList,
          productTicketListData,
          liveSubmitBar,
          productId: data.product_id,
          // 收藏状态
          liveFavorites: {
            favoriteFlag: data.favorite_flag || 'n',
          },
          // 倒计时
          liveRestTime: data.live_status === 'wait' ? data.start_time - Date.now() : 0,
          popupData,
          joinFlag: data.join_flag,
          liveCourseId: data.livecourse_id,
          liveDetail: data,
        }));
      } else {
        yield put(actions.toastFail(msg));
        yield put(actions.jumpToExceptionPage({ message: encodeURIComponent(msg) }));
      }
      yield put(actions.hideLoading());
    },

    // 分享按钮点击
    * share(_, { select, put, call }) {
      const livecourseId = yield select((state) => state.browser.locationQuery.livecourse_id);
      const { head: { code, msg }, data } = yield call(getLiveCourseShareImg, {
        livecourse_id: livecourseId,
        t: Date.now(),
        hcode: 100,
      });

      if (code === 200) {
        yield put(actions.popup.showShareMenu(data));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    // 收藏直播课程
    * collectLive(_, { select, call, put }) {
      const livecourseId = yield select((state) => state.browser.locationQuery.livecourse_id);
      const liveFavorites = yield select((state) => state.liveDetail.liveFavorites);
      const flag = liveFavorites.favoriteFlag === 'y' ? 'n' : 'y';

      const { head: { code, msg } } = yield call(favoriteLiveCourse, {
        livecourse_id: livecourseId,
        flag,
      });
      if (code === 200) {
        yield put(actions.updateState({ liveFavorites: { favoriteFlag: flag } }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    // 不需要购买, 直接获取
    * freeJoin({ payload: { mcuId, password, planId } }, { call, select, put }) {
      const livecourseId = yield select((state) => state.browser.locationQuery.livecourse_id);
      const terminalType = yield select((state) => state.browser.terminalType);
      const mobileNumber = yield select((state) => state.user.mobileNumber);

      const params: any = {
        livecourse_id: livecourseId,
        mobile_number: mobileNumber,
        type: mcuId ? 'membercard' : 'free',
        mcu_id: mcuId,
        // terminal_type: terminalType,
      };
      if (planId) {
        params.plan_id = planId;
      } else if (password) {
        params.join_password = password;
      }

      const { head: { code, msg }, data } = yield call(joinLiveCourse, params);

      if (code === 200) {
        if (data.status !== 4) {
          // 需要支付，下单方式变更，刷新页面
          yield put(actions.toastFail('获取方式已变更，请重试'));
          yield put({ type: 'getLivecourseDetail' });
        } else {
          // 加入成功, 刷新页面
          yield put(actions.toastSucc('获取成功'));
          yield put({ type: 'getLivecourseDetail' });
          yield put({ type: 'setPasswordShow', payload: { passwordShow: false } });
        }
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    // 关闭弹窗
    * changePopup({ payload: { popupVisible } }, { put }) {
      yield put({ type: 'setPopupVisible', payload: { popupVisible } });
    },

    // 复制并关闭
    * copyFunc({ payload: { content, message } }, { put }) {
      copyToClip(content, message);
      yield put({ type: 'setPopupVisible', payload: { popupVisible: false } });
    },

    // 提交密码
    * submitPassword(_, { select, put }) {
      const password = yield select((state) => state.liveDetail.password);
      yield put({ type: 'freeJoin', payload: { password } });
    },

    // 跳转
    * jumpToPage({ payload }, { put }) {
      yield put({ type: 'setPopupVisible', payload: { popupVisible: false } });
      yield put(actions.jumpToPage(payload.path));
    },

    /**
     * 用户点击右上角转发
     */
    * onShareAppMessage(_, { select }) {
      const liveDetail = yield select((state) => state.liveDetail.liveDetail);
      const { title = '', cover_list: coverList } = liveDetail || {};
      let imgUrl = coverList ? coverList.filter((item) => item.type === 'image').map((item) => item.url) : '';
      imgUrl = imgUrl.length > 0 ? imgUrl[0] : '';

      const options: IShare = {
        title,
        link: window.location.href,
        imgUrl,
      };

      return options;
    },
  },
} as Model);
