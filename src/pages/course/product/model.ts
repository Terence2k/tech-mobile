import modelExtend from 'dva-model-extend';
import api from 'api';
import productFunc from 'common/product';
import actions from 'actions';
import { nodeParser } from '@/components/product/productMediaList';
import { model, Model, IShare } from '@/utils/model';

const {
  getCourseDetail,
  joinCourse,
  getCourseShareImg,
  favoriteCourse,
} = api;

/**
 * 底部按钮数据的计算函数
 * @param courseProductDetail 课程的detail
 * @param redirect 当前页面的可重定向路径，方便购买过程传递
 */
function getMenuByCourseProductDetail(courseProductDetail, redirect, planId) {
  const {
    my_membercard_list: myMemberCardList = [],
    join_flag: joinFlag,
    price,
  } = courseProductDetail;

  // 免费加入
  const freeJoin = (mcuId = '') => ({
    type: 'courseProduct/freeJoin',
    payload: {
      mcuId,
      planId,
    },
  });

  // 0 已经拥有
  if (joinFlag === 'y') {
    return [];
  }

  // 1 未拥有 - 可免费获取
  // 1.1 本身免费 / 或通过方案加入
  if (price === 0 || planId) {
    return [{
      type: 'default', label: '免费获取', mode: 'blue', handler: freeJoin(),
    }];
  }

  // 1.2 拥有会员卡所以免费
  const myFreeCard = myMemberCardList.find((card) => card.expire_time > Date.now() && card.free_flag === 'y');
  if (myFreeCard) {
    return [{
      type: 'membercard', label: '会员免费看', mode: 'black', handler: freeJoin(myFreeCard.mcu_id),
    }];
  }

  // 通用的付费处理
  return productFunc.getDefaultMenusByProductDetail(courseProductDetail, redirect);
}

const IS_DEBUG = false;
const testState = {
  isLoading: false,
  // 商品ID
  productId: '',
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

  // components/productTitle（通用）
  productTitle: '录播课程标题',

  // components/productPrice（通用）
  // 注意：
  // 1、如果是免费，不要设置价格相关字段；
  // 2、如果不显示价格，不需要设置任何字段。
  productPrice: {
    // 价格
    price: 999.00,
    // 划线格
    originalPrice: 1000.00,
    // 免费
    // free: true,
  },

  // components/countStat 统计数据（通用）
  // 注意：需要使用字段showStatFlag来驱动是否显示该组件
  countStat: {
    list: ['已报名 {joinCount}', '已学习 {studycount}', '作业数 {postcount}'],
  },

  // components/productDesc（通用）
  productDesc: {
    // 简介
    desc: '简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容...',
  },

  // components/productTeachers（通用）
  productTeachers: {
    name: '授课老师',
    list: [
      {
        // 头像
        headimgurl: 'https://workbest.top/Public/headimg/201730/9bf5285203b927b84d8c65e6516c5441.jpg',
        // 昵称
        nickname: '昵称昵称',
        // 是否主讲
        mainTeacher: 'y',
        // 主讲介绍
        intro: '主讲介绍主讲介绍主讲介绍主讲介绍主讲介绍主讲介绍主讲介绍主讲介绍主讲介绍主讲介绍主讲介绍主讲介绍主讲介绍主讲介绍...',
      },
      {
        // 头像
        headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
        // 昵称
        nickname: '昵称昵称昵称昵称昵称昵称昵称昵称',
      },
      {
        // 头像
        headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
        // 昵称
        nickname: '昵称昵称',
      },
      {
        // 头像
        headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
        // 昵称
        nickname: '昵称昵称',
      },
      {
        // 头像
        headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
        // 昵称
        nickname: '昵称昵称',
      },
      {
        // 头像
        headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
        // 昵称
        nickname: '昵称昵称',
      },
      {
        // 头像
        headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
        // 昵称
        nickname: '昵称昵称',
      },
      {
        // 头像
        headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
        // 昵称
        nickname: '昵称昵称',
      },
    ],
  },

  // components/productSubmitBar（通用）
  // 注意：mode字段确定menu的主题样式；label为当前menu文案；可添加其它字段供点击回调使用（比如使用会员卡的标识type: 'membercard'）。
  productSubmitBar: {
    // 是否禁用状态
    disabled: false,
    // disabled为true时需要
    disabledText: '活动已结束',
    // 分享
    share: {
      // 入口文案
      label: '分享',
    },
    // 提交订单栏
    menus: [{
      // 开能会员卡
      mode: 'black',
      type: 'membercard',
      label: '开通会员享优惠',
    }, {
      // 正价
      mode: 'blue',
      type: 'default',
      label: '立即购买',
    }],
  },

  // components/productMediaList 图文区块（通用）
  productMediaList: {
    name: '课程详情',
    list: [
      {
        // html: '<p><strong><span style="color: #548DD4;">左对齐</span></strong></p><p style="text-align: center;">居中对齐</p><div class="Image-captionContainer"><img src="https://qcdn.beautifulreading.com/upload_files/2019/12/18/28a7bb22de769fb6bb3935287b2eb2b4.png?imageView2/2/w/750/h/0/q/75/format/png" data-props="{&quot;type&quot;:&quot;image_ad&quot;,&quot;sub_entry&quot;:[{&quot;image_url&quot;:&quot;https://qcdn.beautifulreading.com/upload_files/2019/12/18/28a7bb22de769fb6bb3935287b2eb2b4.png&quot;,&quot;width&quot;:1200,&quot;height&quot;:773}]}" width="1210" height="779.4416666666666" class="FocusPlugin--focused"/></div>',
        node: [
          {
            type: 'text',
            attrs: {},
            html: '<strong><span style="color: #548DD4;">左对齐</span></strong>',
            text: '左对齐',
          },
          {
            type: 'text',
            attrs: {
              style: 'text-align: center;',
            },
            html: '居中对齐',
            text: '居中对齐',
          },
          {
            type: 'image_ad',
            subEntry: [
              {
                imageUrl: 'https://qcdn.beautifulreading.com/upload_files/2019/12/18/28a7bb22de769fb6bb3935287b2eb2b4.png',
                width: 1200,
                height: 773,
              },
            ],
          },
        ],
      },
    ],
  },

  // components/productRelatedProductList 商品推荐模块（通用）
  productRelatedProductList: {
    name: '推荐商品',
    list: [{
      // 封面
      coverUrl: ['https://testqiniu.beautifulreading.com/upload_files/2020/11/09/3299c7d17393234e2e9911c2e69759e3.jpeg?sign=46a398a5ce9082a658641862ff577b97&t=5fe5c2a0'],
      // 划线价
      originalPrice: 100.00,
      // 正价
      price: 99.00,
      // 商品id
      productId: '7a7134ef179ef66f7496ad45ae4c3d77',
      // 商品名称
      productName: '划线价-实体商品实体商品实体商品',
      // 小程序路径
      url: '/meidu-weapp/packages/subPackages/goods/index?product_id=7a7134ef179ef66f7496ad45ae4c3d77',
    }, {
      // 封面
      coverUrl: ['https://testqiniu.beautifulreading.com/upload_files/2020/11/09/3299c7d17393234e2e9911c2e69759e3.jpeg?sign=46a398a5ce9082a658641862ff577b97&t=5fe5c2a0'],
      // 划线价
      originalPrice: 100.00,
      // 正价
      price: 99.00,
      // 商品id
      productId: '7a7134ef179ef66f7496ad45ae4c3d77',
      // 商品名称
      productName: '划线价-实体商品',
      // 小程序路径
      url: '/meidu-weapp/packages/subPackages/goods/index?product_id=7a7134ef179ef66f7496ad45ae4c3d77',
    }, {
      // 封面
      coverUrl: ['https://testqiniu.beautifulreading.com/upload_files/2020/11/09/3299c7d17393234e2e9911c2e69759e3.jpeg?sign=46a398a5ce9082a658641862ff577b97&t=5fe5c2a0'],
      // 划线价
      originalPrice: 100.00,
      // 正价
      price: 99.00,
      // 商品id
      productId: '7a7134ef179ef66f7496ad45ae4c3d77',
      // 商品名称
      productName: '划线价-实体商品',
      // 小程序路径
      url: '/meidu-weapp/packages/subPackages/goods/index?product_id=7a7134ef179ef66f7496ad45ae4c3d77',
    }, {
      // 封面
      coverUrl: ['https://testqiniu.beautifulreading.com/upload_files/2020/11/09/3299c7d17393234e2e9911c2e69759e3.jpeg?sign=46a398a5ce9082a658641862ff577b97&t=5fe5c2a0'],
      // 划线价
      originalPrice: 100.00,
      // 正价
      price: 99.00,
      // 商品id
      productId: '7a7134ef179ef66f7496ad45ae4c3d77',
      // 商品名称
      productName: '划线价-实体商品',
      // 小程序路径
      url: '/meidu-weapp/packages/subPackages/goods/index?product_id=7a7134ef179ef66f7496ad45ae4c3d77',
    }],
  },

  // components/productTicketList 优惠券（通用）
  productTicketList: {
    name: '',
    list: [{
      ticketId: 'b270595bee49146fb222e9c8e94470f5',
      name: '春季会员优惠',
      useLimit: 0,
      type: 1,
      discount: 9.9,
      desc: '9.9折,无门槛',
    }, {
      ticketId: 'b270595bee49146fb222e9c8e94470f5',
      name: '夏季会员优惠',
      useLimit: 0,
      type: 1,
      discount: 9.9,
      desc: '8.9折,无门槛',
    }],
  },

  // favorites 收藏按钮
  productFavorites: {
    favoriteFlag: 'y',
  },

  // singlecourseList 课程内容列表
  productSinglecourseList: {
    name: '课程大纲', // 课程内容 or 课程大纲
    type: 'multiple',
    joinFlag: 'n',
    list: [{
      coverUrl: '',
      // 课程内容id
      singlecourseId: '23345678654',
      // 标题
      title: '标题标题标题',
      // 试读。y可试读,n不可试读
      trialFlag: 'n',
      // 是否已过关。y已过关，n未过关
      doneFlag: 'n',
      // 是否已完成。done已完成，wait未学习，studying学习中
      memberDoneFlag: 'wait',
      // 是否能看。y能看，n不能看
      viewFlag: 'y',
      // 显示当前是第几关/节（不计算考试、证书）。内容示例“第3关”、“第2节”
      singlecourseSection: '',
      // 视频、音频时长。如果有多个视频、音频，则返回总时长。格式【HH:mm:ss】
      duration: '00.15',
      // 课程内容类型。video视频 audio音频 text图文 filelist课件 exampaper考试 diploma证书
      type: 'diploma',
      // 完成标准
      // view浏览即完成 duration学习时长 submitExampaper提交考试
      // reachExampaper考试达到分数 practice学员提交作业 score老师点评后 click点击（查看/复制资料)
      doneType: 'view',
      // done已完成，wait未学习，studying学习中
      studyStatus: 'wait',
      // 证书用户id
      diplomaUserId: '',
      // 证书预览图
      previewUrl: '',
      // 考试列表 type=exampaper考试时需要
      exampaperList: [],
    }, {
      coverUrl: '',
      // 课程内容id
      singlecourseId: '23345628654',
      // 标题
      title: '标题标题标题',
      // 试读。y可试读,n不可试读
      trialFlag: 'y',
      // 是否已过关。y已过关，n未过关
      doneFlag: 'n',
      // 是否已完成。done已完成，wait未学习，studying学习中
      memberDoneFlag: 'wait',
      // 是否能看。y能看，n不能看
      viewFlag: 'y',
      // 显示当前是第几关/节（不计算考试、证书）。内容示例“第3关”、“第2节”
      singlecourseSection: '第一节',
      // 视频、音频时长。如果有多个视频、音频，则返回总时长。格式【HH:mm:ss】
      duration: '00.15',
      // 课程内容类型。video视频 audio音频 text图文 filelist课件 exampaper考试 diploma证书
      type: 'video',
      // 完成标准
      // view浏览即完成 duration学习时长 submitExampaper提交考试
      // reachExampaper考试达到分数 practice学员提交作业 score老师点评后 click点击（查看/复制资料)
      doneType: 'view',
      // done已完成，wait未学习，studying学习中
      studyStatus: 'wait',
      // 证书用户id
      diplomaUserId: '',
      // 证书预览图
      previewUrl: '',
      // 考试列表 type=exampaper考试时需要
      exampaperList: [],
    }],
  },

  // 详情
  courseDetail: {},
};

export default modelExtend(model, {
  namespace: 'courseProduct',

  state: IS_DEBUG ? testState : {
    isLoading: true,
    productDesc: {
      desc: '',
    },
  },

  reducers: {
  },

  effects: {

    /**
     * 获取录播课详情
     * https://showdoc.beautifulreading.com/web/#/7?page_id=1802
     */
    * getCourseDetail(action, { select, call, put }) {
      if (IS_DEBUG) {
        return;
      }

      yield put.resolve({ type: 'updateState', payload: { isLoading: true } });

      // 从当前路径获取courseId
      const courseId = yield select((state) => state.browser.locationQuery.course_id);
      const planId = yield select((state) => state.browser.locationQuery.plan_id);
      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);

      const params: any = {
        course_id: courseId,
        client_id: cid,
        user_id: userId,
      };
      if (planId) {
        params.plan_id = planId;
      }
      const { head: { code, msg }, data } = yield call(getCourseDetail, params);

      if (code === 200) {
        // banner区
        const bannerData = data.cover_list.map((cover) => ({
          type: cover.type,
          url: cover.url,
        }));

        // 老师模块
        const teacherModule = data.moduleinfo_rows.find((module) => module.type === 9);
        const teacherList = teacherModule ? teacherModule.teacherList : null;
        const teacherData = {
          name: '授课老师',
          list: teacherList ? teacherList.map((teacher) => ({
            headimgurl: teacher.headimgurl,
            nickname: teacher.nickname,
            mainTeacher: teacher.main_teacher,
            intro: teacher.intro,
          })) : [],
        };

        // 详情模块
        const detailsModule = data.moduleinfo_rows.find(
          (module) => (module.type === 8 && !module.delete_status),
        );
        const productMediaList = detailsModule ? detailsModule.mediaList : [];
        const productMediaListData = {
          name: '课程详情',
          list: productMediaList.map((media) => ({
            node: !media.node ? [] : media.node.map(nodeParser),
          })),
        };

        // 推荐商品模块
        const recommendModule = data.moduleinfo_rows.find((module) => module.type === 17);
        const relatedProductList = (recommendModule && recommendModule.related_product_list)
          ? recommendModule.related_product_list : [];
        const relatedProductListData = {
          name: '推荐商品',
          list: relatedProductList.map((product) => ({
            coverUrl: product.cover_url,
            // 划线价
            originalPrice: product.original_price || 0,
            // 正价
            price: product.price,
            // 商品id
            productId: product.product_id,
            // 商品名称
            productName: product.product_name,
            // 小程序路径
            url: product.url,
            // 跳转信息
            jumpInfo: {
              type: product.path_type,
              objectIds: product.objectIds ? product.objectIds : {},
              webUrl: product.web_url,
            },
          })),
        };

        // 课程大纲模块
        const singleCourseModule = data.moduleinfo_rows.find((module) => module.type === 12);
        const singleCourseList = singleCourseModule ? singleCourseModule.singlecourseList : [];
        const productSinglecourseListData = {
          name: '课程大纲', // 课程内容 or 课程大纲
          type: data.type,
          joinFlag: data.join_flag,
          list: singleCourseList.map((singleCourse) => ({
            // coverUrl: singleCourse.cover_url,
            // 课程内容id
            singlecourseId: singleCourse.singlecourse_id,
            // 标题
            title: singleCourse.title,
            // 试读。y可试读,n不可试读
            trialFlag: singleCourse.trial_flag,
            // 是否已过关。y已过关，n未过关
            doneFlag: singleCourse.done_flag,
            // 是否已完成。done已完成，wait未学习，studying学习中
            memberDoneFlag: singleCourse.member_done_flag,
            // 是否能看。y能看，n不能看
            viewFlag: singleCourse.view_flag,
            // 显示当前是第几关/节（不计算考试、证书）。内容示例“第3关”、“第2节”
            singlecourseSection: singleCourse.singlecourse_section,
            // 视频、音频时长。如果有多个视频、音频，则返回总时长。格式【HH:mm:ss】
            duration: singleCourse.total_duration ? singleCourse.total_duration : '',
            // 学习时长
            studyDuration: singleCourse.study_duration ? singleCourse.study_duration : '',
            // 课程内容类型。video视频 audio音频 text图文 filelist课件 exampaper考试 diploma证书
            type: singleCourse.type,
            // 完成标准
            // view浏览即完成 duration学习时长 submitExampaper提交考试
            // reachExampaper考试达到分数 practice学员提交作业 score老师点评后 click点击（查看/复制资料)
            doneType: singleCourse.done_type,
            // done已完成，wait未学习，studying学习中
            studyStatus: singleCourse.study_status ? singleCourse.study_status : 'wait',
            // 证书ID
            diplomaId: singleCourse.diploma_id,
            // 证书用户id
            diplomaUserId: singleCourse.diploma_user_id,
            // 证书预览图
            previewUrl: singleCourse.preview_url,
            // 考试列表 type=exampaper考试时需要
            exampaperList: singleCourse.exampaperList ? singleCourse.exampaperList.map(
              (exam) => ({
                paperId: exam.paper_id,
                duration: exam.duration,
                questionCount: exam.question_count,
                handinCount: exam.handin_count,
                repeatCount: exam.repeat_count,
                leftRepeatCount: exam.left_repeat_count,
                beginTime: exam.begin_time,
                endTime: exam.end_time,
                score: exam.score,
                status: exam.status,
                topDetailId: exam.top_detail_id,
              }),
            ) : [],
          })),
        };

        // 页面优惠券信息
        const productTicketListData = {
          name: '',
          list: data.ticketList.map((ticket) => ({
            ticketId: ticket.ticket_id,
            name: ticket.name,
            useLimit: ticket.use_limit,
            type: ticket.type,
            discount: ticket.discount,
          })),
        };

        // 当前页面链接，生成的重定向信息
        const redirectStrToCurrentPage = yield select(
          (state) => state.browser.redirectStrToCurrentPage,
        );

        // 底部栏数据
        const productSubmitBarData = {
          // 分享
          share: {
            // 入口文案
            label: '分享',
          },
          // 提交订单栏
          menus: getMenuByCourseProductDetail(data, redirectStrToCurrentPage, planId),
        };

        yield put({
          type: 'updateState',
          payload: {
            isLoading: false,
            productId: data.product.product_id,
            banner: bannerData,
            productTitle: data.product.product_name,
            productPrice: {
              price: data.price || 0,
              originalPrice: data.original_price || 0,
              free: !data.price,
            },
            countStat: {
              list: (data.show_stat_flag === 'y') ? [`已报名${data.join_count}`, `已学习${data.study_count}`, `作业数${data.post_count}`] : [],
            },
            productDesc: {
              desc: data.desc,
            },
            productTeachers: teacherData,
            productSubmitBar: productSubmitBarData,
            productMediaList: productMediaListData,
            productRelatedProductList: relatedProductListData,
            productTicketList: productTicketListData,
            productFavorites: {
              favoriteFlag: data.favorite_flag,
            },
            productSinglecourseList: productSinglecourseListData,
            courseDetail: data,
          },
        });
      } else {
        yield put(actions.toastFail(msg));
        // yield put(actions.jumpToExceptionPage({ message: encodeURIComponent(msg) }));
      }
    },

    /**
     * 不需要购买, 直接获取
     */
    * freeJoin({ payload: { mcuId, planId } }, { call, select, put }) {
      const courseId = yield select((state) => state.browser.locationQuery.course_id);
      const terminalType = yield select((state) => state.browser.terminalType);
      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const mobileNumber = yield select((state) => state.user.mobileNumber);

      const { head: { code, msg }, data } = yield call(joinCourse, {
        client_id: cid,
        course_id: courseId,
        mobile_number: mobileNumber,
        user_id: userId,
        type: mcuId ? 'membercard' : 'free',
        mcu_id: mcuId,
        // terminal_type: terminalType,
        plan_id: planId,
      });

      if (code === 200) {
        if (data.status !== 4) {
          // 需要支付，下单方式变更，刷新页面
          yield put({ type: 'popup/toastFail', payload: { msg: '获取方式已变更，请重试' } });
          yield put({ type: 'getCourseDetail' });
        } else {
          // 加入成功, 刷新页面
          yield put(actions.toastSucc('获取成功'));
          yield put({ type: 'getCourseDetail' });
        }
      } else {
        yield put({ type: 'popup/toastFail', payload: { msg } });
      }
    },

    /**
     * 分享按钮点击
     */
    * share(_, { select, put }) {
      const courseId = yield select((state) => state.browser.locationQuery.course_id);
      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const sharePicUrl = getCourseShareImg({
        course_id: courseId,
        client_id: cid,
        user_id: userId,
        t: Date.now(),
        hcode: 100,
      });

      yield put({ type: 'popup/showShareMenu', payload: { sharePicUrl } });
    },

    /**
     * 收藏课程
     */
    * favoriteCourse(_, { call, select, put }) {
      const courseId = yield select((state) => state.browser.locationQuery.course_id);
      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const productFavorites = yield select((state) => state.courseProduct.productFavorites);

      const flag = productFavorites.favoriteFlag === 'y' ? 'n' : 'y';
      const { head: { code, msg } } = yield call(favoriteCourse, {
        client_id: cid,
        course_id: courseId,
        user_id: userId,
        flag,
      });

      if (code === 200) {
        yield put({ type: 'updateState', payload: { productFavorites: { favoriteFlag: flag } } });
      } else {
        yield put({ type: 'popup/toastFail', payload: { msg } });
      }
    },

    /**
     * 用户点击右上角转发
     */
    * onShareAppMessage(_, { select }) {
      const courseDetail = yield select((state) => state.courseProduct.courseDetail);
      const { title = '', desc = '', cover_url: coverUrl } = courseDetail || {};
      const imgUrl = coverUrl && coverUrl.length > 0 ? coverUrl[0] : '';

      const options: IShare = {
        title,
        desc,
        link: window.location.href,
        imgUrl,
      };

      return options;
    },
  },
} as Model);
