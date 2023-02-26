/* eslint-disable no-nested-ternary */
import modelExtend from 'dva-model-extend';
import moment from 'moment';
import { stringify } from 'qs';
import actions from 'actions';
import api from 'api';
import { model, Model } from '@/utils/model';
// import { strArrayToObject } from 'utils/utils';
// import { history, router } from 'umi';
// import { parse, stringify } from 'qs';
// import Cookies from 'js-cookie';
// import config from 'utils/config';

// const { pathToRegexp } = require('path-to-regexp');

const {
  getMyMembercardInfo,
  getBanner,
  getIconNavigationList,
  getMyCourseList,
  getLivecourseList,
  getSubjectList,
} = api;

// const isDevelopment = process.env.NODE_ENV === 'development';

const IS_DEBUG = false;
const testState = {
  // memberCard 会员卡
  memberCard: {
    label: '开通会员卡',
    desc: '课程商品8折领取',
  },

  // components/banner（通用）
  // 注意：当前视频暂不支持
  banner: [
    {
      type: 'image',
      url: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
    },
    {
      type: 'image',
      url: 'https://qcdn.beautifulreading.com/upload_files/2020/04/15/c785810835e1e816a4b5ed50acad3406.jpeg',
    },
    {
      type: 'video',
      url: 'https://qcdn.beautifulreading.com/upload_files/2020/09/29/5a4c0f086e7c719763d9188a855d2167.mp4',
      duration: 15,
    },
  ],

  // iconNavigationList 金刚区
  iconNavigationList: {
    name: '',
    list: [{
      appid: 'f02c29ff-cf2e-4625-afe8-49534016d193',
      catalog_id: '388894f18118d640ee6183b685f00758',
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/11/659e0f7e5aed2ee64fd14653201e825c.png',
      link_type: 'page_navigation',
      navigation_id: '15c9c6d47c52d832ad4d9995e7c7c458',
      title: '课程',
      type: 'self',
      url: 'pages/tabbar-packages/catalog/index?catalog_id=388894f18118d640ee6183b685f00758&navigation_id=15c9c6d47c52d832ad4d9995e7c7c458',
      webUrl: '/tabbar-packages/catalog/?catalog_id=388894f18118d640ee6183b685f00758&navigation_id=15c9c6d47c52d832ad4d9995e7c7c458?',
      jumpInfo: {
        webUrl: '/index',
      },
    }, {
      appid: 'f02c29ff-cf2e-4625-afe8-49534016d193',
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/11/dfd3572b5bda8d6429608b4e34f3a8e7.png',
      link_type: 'opern',
      navigation_id: '2f096f97ab55e97f7a4778554d6d2886',
      title: '资料',
      type: 'self',
      url: 'pages/tabbar-packages/opern/index?navigation_id=2f096f97ab55e97f7a4778554d6d2886',
      jumpInfo: {
        webUrl: '/index',
      },
    }, {
      appid: 'f02c29ff-cf2e-4625-afe8-49534016d193',
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/11/68a5432bd31fa2edfd1ceec775a057f0.png',
      link_type: 'lesson',
      navigation_id: 'ed3eb6fabb7a944ade93bfbfe2728ed6',
      title: '线下课程',
      type: 'self',
      url: 'pages/tabbar-packages/lesson/index?navigation_id=ed3eb6fabb7a944ade93bfbfe2728ed6',
      jumpInfo: {
        webUrl: '/index',
      },
    }, {
      appid: 'f02c29ff-cf2e-4625-afe8-49534016d193',
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/11/9dc82c9e07c6f8ce513eec0de8e8f9c4.png',
      link_type: 'daka',
      navigation_id: 'b68461cab6e952c0448ed32458a66cda',
      title: '打卡',
      type: 'self',
      url: 'pages/tabbar-packages/daka/index?navigation_id=b68461cab6e952c0448ed32458a66cda',
      jumpInfo: {
        webUrl: '/index',
      },
    }],
  },

  // 我的课程
  myCourseList: {
    // 标题
    title: '我的课程',
    // 是否显示全部按钮
    allFlag: 'y',
    // 列表
    list: [],
  },

  // 直播课程
  liveCourseList: {
    // 标题
    title: '直播课',
    // 是否显示全部按钮
    allFlag: 'y',
    // 展示内容的样式。1显示数据，2显示简介
    showData: 1,
    // 列表显示的样式。默认1: 样式1，2:样式2， 3:样式3
    showTpl: 1,
    // 列表
    list: [{
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
      price: 0,
      originalPrice: 0,
      showStat: ['已学习：100', '已报名：1000'],
      liveStatus: '未开始',
      liveStatusStyles: {
        color: '#FFF',
        background: '#FFA940',
      },
      title: '字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查',
      timeText: '2021-01-01 15:30',
      courseId: 'c9456fc1f595a5505e54160b7a5ec42d',
    }, {
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
      price: 66.00,
      originalPrice: 90.00,
      liveStatus: '未开始',
      liveStatusStyles: {
        color: '#FFF',
        background: '#FFA940',
      },
      title: '字段检查',
      timeText: '2021-01-01 15:30',
      courseId: 'c9456fc1f595a5505e54160b7a5ec42d',
    }, {
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
      price: 0,
      originalPrice: 0,
      liveStatus: '已结束',
      liveStatusStyles: {
        color: '#FFF',
        background: '#BFBFBF',
      },
      title: '字段检查',
      timeText: '2021-01-01 15:30',
      courseId: 'c9456fc1f595a5505e54160b7a5ec42d',
    }],
  },

  // 课程分组列表
  subject: [{
    // 分组标题
    title: '新版录播课程',
    // 是否显示全部按钮
    allFlag: 'y',
    // 展示内容的样式。1显示数据，2显示简介
    showData: 1,
    // 列表显示的样式。默认1: 样式1，2:样式2， 3:样式3
    showTpl: 1,
    // 分组id
    subjectId: '',
    // 教育方案
    contentRows: [{
      objectType: 314,
      objectId: '4dd7dd110183e03aed1397ebfc879333',
      teachingPlan: {
        featureList: [],
        image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
        price: 88,
        originalPrice: 99,
        studyCount: 1,
        planId: '4dd7dd110183e03aed1397ebfc879333',
        title: '证书测试',
        timePeriod: '2021-01-05',
        planTeachers: [
          {
            userId: '97e6d905bd51f37e7c780234092b7d2b---',
            nickname: '小鱼儿',
            image: 'https://qcdn.beautifulreading.com/301a322381cc1b4a4530ca3c04cad3c4',
          },
        ],
      },
    }, {
      objectType: 314,
      objectId: '4dd7dd110183e03aed1397ebfc879333',
      teachingPlan: {
        featureList: [],
        image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
        price: 0,
        originalPrice: 0,
        studyCount: 1,
        itemCount: 1,
        planId: '4dd7dd110183e03aed1397ebfc879333',
        title: '证书测试',
        timePeriod: '2021-01-05',
        planTeachers: [
          {
            image: 'https://qcdn.beautifulreading.com/301a322381cc1b4a4530ca3c04cad3c4',
          },
        ],
      },
    }],
    // 预约
    reservationList: [{
      reservationSubjects: ['都是付费', '都是免费', 'text'],
      reservationId: '54a1a8ccb75e1e76d7edc825e1fe2eda',
      title: '新预约，我不是老师2',
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/04/09/95383022dce6df61e906b713565d777b.jpeg',
      timeText: '2020-01-01',
      reservationTeachers: [
        {
          image: 'https://qcdn.beautifulreading.com/bac406c625f3644985b2cc0ff069c4b1',
        },
        {
          image: 'https://qcdn.beautifulreading.com/9af45ef7f9fefd785b5f4aea9aa4d3cd',
        },
      ],
    }],
    // 录播课
    courseList: [{
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
      price: 99.00,
      originalPrice: 100.00,
      showStat: ['已学习：100', '已报名：1000'],
      title: '字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查',
      desc: '字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查',
      courseId: 'c9456fc1f595a5505e54160b7a5ec42d',
    }, {
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
      price: 99.00,
      originalPrice: 100.00,
      showStat: ['已学习：100', '已报名：1000'],
      title: '字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查',
      desc: '',
      courseId: 'c9456fc1f595a5505e54160b7a5ec42d',
    }],
  }],
  subjectCount: 0,

  // // 选择优惠券（已经领取的）
  // popupAvailableTicket: {
  //   visible: false,
  //   // 当前选择
  //   value: '2ce2f60069013b106a717b1800034ca6',
  //   // 列表
  //   list: [{
  //     clientId: 'e0e67b6404d3d9f86e6452dc6360926e',
  //     ticketId: '2ce2f60069013b106a717b1800034ca6',
  //     userId: '4a5ffa337cfe5136e543f7f94b2e18d2',
  //     userTicketId: '31ce029bb10c3b69069c51b8c6f1bcaa',
  //     status: 1,
  //     receiveType: 'user',
  //     receiveTime: '2021-01-04T06:22:50.681Z',
  //     useBeginTime: '2021-01-04T06:22:50.681Z',
  //     useEndTime: '2021-02-03T06:22:50.681Z',
  //     name: '【dev】-实体优惠券',
  //     scopeType: 1,
  //     productList: [
  //       'c3500f6d0f1f61f6ca15db97057e60b6',
  //       '7a7134ef179ef66f7496ad45ae4c3d77',
  //     ],
  //     useLimit: 1,
  //     useLimitPrice: 0,
  //     type: 1,
  //     discount: 7,
  //     totalNum: 6,
  //     receiveNum: 1,
  //     receiveDateBegin: '2021-01-03T16:00:00.000Z',
  //     receiveDateEnd: '2021-01-09T15:59:59.000Z',
  //     expireType: 2,
  //     limitDay: 30,
  //     receiveLimit: 1,
  //     receiveWay: 0,
  //     receiveRule: 'normal',
  //     deleteStatus: 0,
  //     createTime: '2021-01-04T06:17:33.983Z',
  //     updateTime: '2021-01-04T06:22:50.683Z',
  //     desc: {
  //       useLimit: '满0元可用',
  //       discount: '7折',
  //       scopeType: '仅限部分指定商品',
  //       instruction: '适用范围：仅限部分指定商品，满0元可用，不可抵扣运费，仅原价购买可用',
  //       time: '有效期：2021.01.04-2021.02.03',
  //     },
  //     salePrice: 6.216,
  //   }],
  // },
};

export const namespace = 'index';
export default modelExtend(model, {
  namespace,

  state: IS_DEBUG ? testState : { isLoading: true },

  reducers: {

  },
  effects: {
    /**
     * 76.8 获取我的会员卡信息 getMyMembercardInfo
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=2096
     */
    * getMyMembercardInfoResult(_, { select, call, put }) {
      const isLogin = yield select((state) => state.user.isLogin);
      if (!isLogin) {
        return;
      }

      yield put.resolve(actions.updateState({ isLoading: true }));

      const cid = yield select((state) => state.client.cid);

      const { head: { code, msg }, data } = yield call(getMyMembercardInfo, {
        client_id: cid,
      });
      if (code === 200) {
        const result = { ...data };
        const myMembercard = result.my_membercard || [];
        const showMembercard = result.show_membercard || {};

        const memberCard: any = { label: '', desc: '' };

        if (myMembercard.length) {
          memberCard.label = '我的会员卡';
          myMembercard.forEach((item: any, index: number) => {
            memberCard.desc += `${index > 0 ? '、' : ''}${item.title}`;
          });
        } else if (showMembercard.rights_desc && showMembercard.rights_desc.length) {
          memberCard.label = '开通会员';
          showMembercard.rights_desc.forEach((item: string, index: number) => {
            memberCard.desc += `${index > 0 ? '、' : ''}${item}`;
          });
        }

        yield put(actions.updateState({ isLoading: false, memberCard }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 50.14 获取模块通用头部banner getBanner
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=1593
     */
    * getBannerResult(_, { select, call, put }) {
      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const type = 'course';

      yield put.resolve(actions.updateState({ isLoading: true }));
      const { head: { code, msg }, data } = yield call(getBanner, {
        client_id: cid,
        user_id: userId,
        type,
      });

      if (code === 200) {
        const result = { ...data };
        const banner = [...result.rows].map((item) => {
          const i: any = {};
          // TODO：暂时时添加图片类型
          i.type = 'image';
          i.url = item.cover;
          i.jumpInfo = {
            webUrl: item.web_url,
            type: item.path_type,
            objectIds: item.object_ids,
          };

          return i;
        });

        yield put(actions.updateState({ isLoading: false, banner }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 50.52 获取图标导航列表 getIconNavigationList
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=2506
     */
    * getIconNavigationListResult(_, { call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const { head: { code, msg }, data } = yield call(getIconNavigationList, {});
      if (code === 200) {
        const result = { ...data };
        const rows = result.rows || [];

        yield put(actions.updateState({
          isLoading: false,
          iconNavigationList: {
            list: rows.map((item) => {
              const ret = {
                catalogId: item.catalog_id,
                linkType: item.link_type,
                navigationId: item.navigation_id,
                image: item.image,
                title: item.title,
                jumpInfo: {
                  webUrl: item.web_url,
                  type: item.path_type,
                  objectIds: item.object_ids,
                },
              };

              if (item.link_type === 'daka') {
                ret.jumpInfo.webUrl = `/daka/list?${stringify({ navigationId: item.navigation_id })}`;
              } else if (item.link_type === 'opern') {
                ret.jumpInfo.webUrl = `/file/list?${stringify({ navigationId: item.navigation_id })}`;
              } else if (item.link_type === 'lesson') {
                ret.jumpInfo.type = 'lesson_index';
                ret.jumpInfo.objectIds = {};
              } else if (item.link_type === 'page_navigation') {
                ret.jumpInfo.webUrl = `/tabbar-packages/catalog?${stringify({ catalogId: item.catalog_id, navigationId: item.navigation_id })}`;
              }

              return ret;
            }),
          },
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 63.3.1 获取我的课程列表+ getMyCourseList
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=1801
     */
    * getMyCourseListResult(_, { select, call, put }) {
      const isLogin = yield select((state) => state.user.isLogin);
      if (!isLogin) {
        return;
      }

      yield put.resolve(actions.updateState({ isLoading: true }));

      const cid = yield select((state) => state.client.cid);

      const { head: { code, msg }, data } = yield call(getMyCourseList, { client_id: cid });
      if (code === 200) {
        const result = { ...data };

        yield put(actions.updateState({
          isLoading: false,
          myCourseList: {
            title: '我的课程',
            allFlag: 'y',
            list: [...result.rows],
          },
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 75.1 获取直播课列表 getLivecourseList
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=2022
     */
    * getLivecourseListResult(_, {
      select, call, all, put,
    }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const { cid, miniResourceList } = yield select((state) => state.client);

      if (miniResourceList.includes('1611')) {
        const [doingResult, waitResult, doneResult] = yield all([
          call(getLivecourseList, { client_id: cid, live_status: 'doing' }),
          call(getLivecourseList, { client_id: cid, live_status: 'wait' }),
          call(getLivecourseList, { client_id: cid, live_status: 'done' }),
        ]);

        if (doingResult.head.code === 200
          || waitResult.head.code === 200
          || doneResult.head.code === 200) {
          const doingRows = doingResult.head.code === 200 ? doingResult.data.rows : [];
          const waitRows = waitResult.head.code === 200 ? waitResult.data.rows : [];
          const doneRows = doneResult.head.code === 200 ? doneResult.data.rows : [];
          const result = [...doingRows, ...waitRows, ...doneRows].slice(0, 4).map((item) => {
            const i: any = {};
            i.image = item.image;
            i.price = item.price;
            i.originalPrice = item.original_price;
            i.showStat = item.show_stat;
            i.liveStatusStyles = item.live_status_styles;
            i.liveStatus = item.live_status === 'wait' ? '未开始' : (item.live_status === 'doing' || item.live_status === 'delay' ? '直播中' : '已结束');
            i.liveStatusStyles = item.live_status === 'wait' ? {
              color: '#FFF',
              background: '#FFA940',
            } : (item.live_status === 'doing' || item.live_status === 'delay' ? { color: '#FFF', background: '#409EFF' } : { color: '#FFF', background: '#BFBFBF' });
            i.title = item.title;
            i.timeText = moment(item.start_time).format('YYYY-MM-DD HH:mm');
            i.courseId = item.course_id;
            i.livecourseId = item.livecourse_id;

            return i;
          });

          yield put(actions.updateState({
            isLoading: false,
            liveCourseList: {
              // 标题
              title: '直播课',
              // 是否显示全部按钮
              allFlag: 'y',
              // 展示内容的样式。1显示数据，2显示简介
              showData: 1,
              // 列表显示的样式。默认1: 样式1，2:样式2， 3:样式3
              showTpl: 1,
              // 列表
              list: result,
            },
          }));
        } else {
          yield put(actions.toastFail(doingResult.head.msg));
        }
      }
    },

    /**
     * 63.2 获取首页课程分组+ getSubjectList
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=1799
     */
    * getSubjectListResult({ payload = { skip: 0, limit: 10 } }, {
      select, call, all, put,
    }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const indexState = yield select((state) => state[namespace]);

      const { head: { code, msg }, data } = yield call(getSubjectList, {
        client_id: cid,
        user_id: userId,
        skip: payload.skip,
        limit: payload.limit,
      });

      if (code === 200) {
        const result = { ...data };
        const subjectCount = result.count || 0;
        let subject = indexState.subject || [];
        subject = payload.skip === 0 ? [] : subject;
        subject = subject.concat([...result.rows].map((item) => {
          const i: any = {};
          // 分组标题
          i.title = item.title;
          // 是否显示全部按钮
          i.allFlag = item.all_flag;
          // 展示内容的样式。1显示数据，2显示简介
          i.showData = item.show_data;
          // 列表显示的样式。默认1: 样式1，2:样式2， 3:样式3
          i.showTpl = item.show_tpl || 1;
          // 分组id
          i.subjectId = item.subject_id;
          // 教育方案
          i.contentRows = item.content_rows ? [...item.content_rows].map((content) => {
            const c: any = {};
            c.objectId = content.object_type;
            c.objectType = content.object_type;
            c.teachingPlan = {
              featureList: content.teaching_plan.feature_list || [],
              image: content.teaching_plan.cover_list.length > 0 ? content.teaching_plan.cover_list[0].url : '',
              price: content.teaching_plan.price,
              originalPrice: content.teaching_plan.original_price,
              studyCount: content.teaching_plan.join_count || 0,
              itemCount: content.teaching_plan.item_count || 0,
              planId: content.teaching_plan.plan_id,
              title: content.teaching_plan.title,
              timePeriod: content.teaching_plan.start_time && content.teaching_plan.end_time ? `${moment(content.teaching_plan.start_time).format('YYYY.MM.DD')} - ${moment(content.teaching_plan.end_time).format('YYYY.MM.DD')}` : '',
              planTeachers: content.teaching_plan.teacher_list.map((teacher) => {
                const t: any = {};
                t.userId = teacher.user_id;
                t.nickname = teacher.nickname;
                t.image = teacher.headimgurl;
                return t;
              }),
            };

            return c;
          }) : [];

          // 预约
          i.reservationList = item.reservation_list ? [...item.reservation_list].map((r) => {
            const z: any = {};
            z.reservationSubjects = r.subjects || [];
            z.reservationId = r.reservation_id || '';
            z.title = r.title || '';
            z.image = r.cover_list && r.cover_list.length > 0 ? r.cover_list[0].image : '';
            z.timeText = r.start_time && r.end_time ? `${moment(r.start_time).format('YYYY.MM.DD')} - ${moment(r.end_time).format('YYYY.MM.DD')}` : '';
            z.reservationTeachers = r.teacher_list ? r.teacher_list.map((teacher) => {
              const t: any = {};
              t.image = teacher.headimgurl;
              return t;
            }) : [];

            return z;
          }) : [];

          // 考试
          i.exampaperList = item.exampaper_list ? item.exampaper_list.map((c) => {
            const n: any = {};
            n.paperId = c.paper_id;
            n.title = c.title;
            n.image = c.image ? c.image : '';
            n.price = c.price;
            n.originalPrice = c.original_price;

            return n;
          }) : [];

          // 活动报名
          i.applyFormList = item.apply_form_list ? item.apply_form_list.map((c) => {
            const images = c.cover_list ? c.cover_list.filter((cover) => cover.type === 'image').map((cover) => cover.url) : [];
            const n: any = {};
            n.applyFormId = c.apply_form_id;
            n.title = c.title;
            n.image = images.length > 0 ? images[0] : '';
            n.price = c.price;
            n.originalPrice = c.original_price;

            return n;
          }) : [];

          // 录播课
          i.courseList = item.courseList ? item.courseList.map((c) => {
            const n: any = {};
            n.image = c.cover_url ? c.cover_url[0] : '';
            n.price = c.price;
            n.originalPrice = c.original_price;
            n.showStat = item.show_data === 1 ? [`已报名${c.join_count || 0}`, `已学习${c.study_count || 0}`, `作业数${c.post_count || 0}`] : [`浏览量${c.view_count || 0}`];
            n.title = c.title;
            n.desc = c.desc;
            n.courseId = c.course_id;

            return n;
          }) : [];

          return i;
        }));

        yield put(actions.updateState({
          isLoading: false,
          subject,
          subjectCount,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 页面加载
     */
    * onLoad(_, { select, all, put }) {
      if (IS_DEBUG) {
        return;
      }

      const isJustPopState = yield select((s) => s.browser.isJustPopState);
      const isLoading = yield select((s) => s.index.isLoading);
      if (isJustPopState && !isLoading) {
        return;
      }

      const types = [
        'getMyMembercardInfoResult',
        'getBannerResult',
        'getIconNavigationListResult',
        'getMyCourseListResult',
        'getLivecourseListResult',
        'getSubjectListResult',
      ];
      yield put(actions.showLoading('加载中...'));
      // yield types.map((type) => put({ type }));
      // yield take(types);
      yield all(types.map((type) => put.resolve({ type })));
      yield put(actions.hideLoading());
    },

    /**
     * 页面下拉事件的处理函数
     */
    * onPullDownRefresh(_, { put }) {
      if (IS_DEBUG) {
        return;
      }

      yield put(actions.updateState({ refreshing: true }));
      yield put.resolve({ type: 'onLoad' });
      yield put(actions.updateState({ refreshing: false }));
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
        subject = [],
        subjectCount,
      } = yield select((state) => state[namespace]);

      console.log('onReachBottom', subject);

      if (isLoading || subject.length >= subjectCount) return;

      yield put(actions.showLoading('加载中...'));
      yield put.resolve({ type: 'getSubjectListResult', payload: { skip: subject.length, limit: 10 } });
      yield put(actions.hideLoading());
    },
  },
} as Model);
