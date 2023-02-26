import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import { Toast } from 'antd-mobile';
import actions from 'actions';
import api from 'api';
import { TState, IClient, IUser } from '@/models/types';

import { IPopup } from './types';

const {
  getPopMessageList,
  viewPopMessage,
  clickPopMessage,
} = api;

let popupList: any = [];

export default modelExtend(model, {
  namespace: 'popup',
  state: {
    // 分享底部弹出的菜单
    shareMenu: {
      menus: [{
        label: '生成卡片',
        type: 'card',
      }, {
        label: '复制链接',
        type: 'link',
      }],

      // 入口 显示 || 隐藏
      visible: false,
      // 海报
      sharePicUrl: '',
    },

    // 海报弹框
    card: {
      visible: false,
      picUrl: '',
      tip: '',
    },

    // 二维码弹框
    qrCode: {
      visible: false,
      link: '',
      tip: '',
      onHideHandler: null,
    },

    // 图片弹框
    image: {
      visible: false,
      // 图片（比如证书）
      picUrl: '',
    },

    // 会员卡弹框
    memberCard: {
      visible: false,
      // 列表
      list: [{
        title: '会员卡',
        expireTime: 1609321763424,
      }],
      path: '/memberCard/detail',
      params: {
        membercard_id: '37b5adc76e0650b303290d63e208a189',
      },
    },

    // 优惠券弹框
    ticket: {
      visible: false,
      // 列表
      list: [{
        name: '指定课程的',
        desc: {
          useLimit: '无门槛',
          discount: '66折',
        },
      }, {
        name: '标题标题',
        desc: {
          useLimit: '满0.01元可用',
          discount: '5折',
        },
      }],
      titleText1: '123',
      titleText2: '456',
      buttonText: '去看看哦',
      path: '/mine/myTickets',
    },

    // 预览图片地址
    previewPicture: {
      visiable: false,
      url: '',
    },
    // 预览视频地址
    previewView: {
      visiable: false,
      url: '',
    },
  } as IPopup,

  reducers: {
  },

  effects: {
    /**
     * 失败的toast
     */
    * toastFail({ payload: { msg, duration = 2 } }) {
      yield Toast.fail(msg, duration);
    },

    /**
     * 成功的toast
     */
    * toastSucc({ payload: { msg, duration = 2 } }) {
      yield Toast.success(msg, duration);
    },

    /**
     * 加载中的toast
     */
    * loadingShow({ payload: { msg = '', duration = 0 } }) {
      yield Toast.loading(msg, duration);
    },

    /**
     * 关闭所有toast
     */
    * loadingHide() {
      yield Toast.hide();
    },
    // /**
    //  * 老师批改页显示
    //  */
    // * showCorrectMenu({ payload: { userInfo } }, { put, select }) {
    //   yield put(actions.updateState({
    //     correctInfo: {
    //       visible: true,
    //     },
    //   }));
    //   console.log(userInfo, '显示是 showCorrectMenu打开的发送参数');
    // },
    // /**
    //  * 隐藏老师批改页
    //  */
    // * hideCorrectMenu(_, { put }) {
    //   yield put(actions.updateState({
    //     correctInfo: {
    //       visible: false,
    //     },
    //   }));
    // },
    // /**
    //  *  录音功能
    //  */
    // * recording(_, { put }) {
    //   console.log('点击录音');
    //   // 录音功能
    //   //1. 创建音波
    //   // window.AudioContext = window.AudioContext || window.webkitAudioContext;
    //   // let audioCtx = new AudioContext();
    //   // let oscillator = audioCtx.createOscillator();
    //   // let gainNode = audioCtx.createGain();

    //   // oscillator.connect(gainNode);
    //   // gainNode.connect(audioCtx.destination);
    //   // oscillator.type = 'sine';
    //   // oscillator.frequency.value = 196.00;
    //   // gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    //   // gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
    //   // oscillator.start(audioCtx.currentTime);
    //   // gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
    //   // oscillator.stop(audioCtx.currentTime + 1);

    //   // 获取录音权限
    //   navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    //   // navigator.mediaDevices.getUserMedia(videoObj, (stream) => { }, errBack)
    //   // update url
    //   yield put(actions.updateState({
    //     correctInfo: {
    //       visible: true,
    //     },
    //   }));
    // },
    // /**
    //  * uploadPic
    //  */
    // * uploadPic({ payload: { e } }, { call }) {
    //   let imgFile = e.target.files[0];
    //   let formData = new FormData();
    //   let filesList = formData.append('file', imgFile);
    //   console.log(e, filesList, 'file document');
    //   const res = yield call(getWxMediaUrl, {
    //     media_id: filesList,
    //   });
    //   console.log(res, 'pic 上传 结果');
    // },
    // /**
    //  *发送批改的信息
    //  */
    // * sendCorrectionInfo({ payload: { correctionInfo } }, { put, select, call }) {
    //   yield put.resolve(actions.updateState({
    //     correctInfo: {
    //       visible: false,
    //     },
    //   }));
    //   console.log('-----发送批改的信息', correctionInfo);
    //   const res = yield call(correctPapers, {
    //     paper_id: '',
    //     question_id: '',
    //   });
    //   console.log(res);
    // },
    /**
     * 显示分享菜单
     */
    * showPreviewPicture({ payload: { e } }, { put }) {
      console.log(e, 'showPic');

      yield put(actions.updateState({
        previewPicture: {
          visiable: true,
          url: e,
        },
      }));
    },
    * hidePreviewPicture(_, { put }) {
      yield put(actions.updateState({
        previewPicture: {
          visiable: false,
          url: '',
        },
      }));
    },
    * showPreviewVideo({ payload: { e } }, { put }) {
      console.log(e, 'url e');

      yield put(actions.updateState({
        previewView: {
          visiable: true,
          url: e,
        },
      }));
    },
    * hidePreviewVideo(_, { put }) {
      yield put(actions.updateState({
        previewView: {
          visiable: false,
          url: '',
        },
      }));
    },
    * showShareMenu({
      payload: {
        sharePicUrl, menus = [],
      },
    }, { put }) {
      yield put(actions.updateState({
        shareMenu: {
          menus: menus && menus.length ? menus : [
            {
              label: '生成卡片',
              type: 'card',
            }, {
              label: '复制链接',
              type: 'link',
            },
          ],
          // 入口 显示 || 隐藏
          visible: true,
          // 海报
          sharePicUrl,
        },
      }));
    },

    /**
     * 隐藏分享Menu
     */
    * hideShareMenu(_, { put }) {
      yield put(actions.updateState({
        shareMenu: {
          menus: [{
            label: '生成卡片',
            type: 'card',
          }, {
            label: '复制链接',
            type: 'link',
          }],
          // 入口 显示 || 隐藏
          visible: false,
          // 海报
          sharePicUrl: '',
        },
      }));
    },

    /**
     * 显示Card
     */
    * showCard({ payload: { picUrl, tip, onHideHandler } }, { put }) {
      yield put(actions.updateState({
        card: {
          // 入口 显示 || 隐藏
          visible: true,
          // 海报
          picUrl,
          // 提示
          tip,
          // 关闭事件
          onHideHandler,
        },
      }));
    },

    /**
     * 隐藏Card
     */
    * hideCard(_, { put, select }) {
      const onHideHandler = yield select((state) => state.popup.card.onHideHandler);
      if (onHideHandler) {
        yield put(onHideHandler);
      }
      yield put(actions.updateState({
        card: {
          // 入口 显示 || 隐藏
          visible: false,
          // 海报
          picUrl: '',
          // tip
          tip: '',
          // 关闭事件
          onHideHandler: null,
        },
      }));
    },

    /**
     * 显示qrcode
     */
    * showQrCode({ payload: { link, tip, onHideHandler } }, { put }) {
      yield put(actions.updateState({
        qrCode: {
          // 入口 显示 || 隐藏
          visible: true,
          // 二维码链接
          link,
          // 提示
          tip,
          // 关闭的事件触发
          onHideHandler,
        },
      }));
    },

    /**
     * 隐藏qrcode
     */
    * hideQrCode(_, { select, put }) {
      const onHideHandler = yield select((state) => state.popup.qrCode.onHideHandler);
      if (onHideHandler) {
        yield put(onHideHandler);
      }
      yield put(actions.updateState({
        qrCode: {
          // 入口 显示 || 隐藏
          visible: false,
          // 二维码链接
          link: '',
          // 提示
          tip: '',
          // 关闭的事件触发
          onHideHandler: null,
        },
      }));
    },

    /**
     * 显示图片
     */
    * showImage({ payload: { picUrl } }, { put }) {
      yield put(actions.updateState({
        image: {
          // 入口 显示 || 隐藏
          visible: true,
          // 图片（比如证书）
          picUrl,
        },
      }));
    },

    /**
     * 隐藏图片
     */
    * hideImage(_, { put }) {
      yield put(actions.updateState({
        image: {
          // 入口 显示 || 隐藏
          visible: false,
          // 图片（比如证书）
          picUrl: '',
        },
      }));

      yield put({ type: 'nextPopMessage' });
    },

    /**
     * 显示会员卡弹框
     */
    * showMemberCard({ payload: { memberCardListInfo } }, { put }) {
      yield put(actions.updateState({
        memberCard: {
          visible: true,
          ...memberCardListInfo,
        },
      }));
    },

    /**
     * 隐藏图片
     */
    * hideMemberCard(_, { put }) {
      yield put(actions.updateState({
        memberCard: {
          visible: false,
          // 列表
          list: [],
          path: '',
        },
      }));

      yield put({ type: 'nextPopMessage' });
    },

    /**
     * 显示优惠券弹框
     */
    * showTicket({ payload: { ticketListInfo } }, { put }) {
      yield put(actions.updateState({
        ticket: {
          visible: true,
          ...ticketListInfo,
        },
      }));
    },

    /**
     * 隐藏优惠券列表
     */
    * hideTicket(_, { put, call }) {
      yield put.resolve(actions.updateState({
        ticket: {
          visible: false,
          // 列表
          list: [],
          path: '',
          titleText1: '',
          titleText2: '',
          buttonText: '',
        },
      }));

      yield put({ type: 'nextPopMessage' });
    },

    * nextPopMessage(_, { call, put }) {
      // 当前消息已读、已点
      const current = popupList.shift();
      if (!current) {
        return;
      }

      const messageIdList = current.message_id_list || [];

      yield call(viewPopMessage, { message_ids: messageIdList });
      yield call(clickPopMessage, { message_ids: messageIdList });

      // 拿下一个消息弹出
      yield put({ type: 'checkPopMessage', payload: { refresh: false } });
    },

    * checkPopMessage({ payload: { refresh } }, { select, put, call }) {
      const client: IClient = yield select((state: TState) => state.client);
      const user: IUser = yield select((state: TState) => state.user);
      if (!user.isLogin) {
        // 未登录状态，不拿
        return;
      }

      if (refresh) {
        const { head: { code, msg }, data } = yield call(getPopMessageList, {
          client_id: client.cid,
          user_id: user.userId,
        });
        if (code === 200) {
          popupList = data.rows;
        } else {
          yield put({ type: 'toastFail', payload: { msg } });
        }
      }

      const first = popupList.length > 0 ? popupList[0] : null;
      if (!first) {
        return;
      }

      if (first.scene_type === 'receive_ticket') {
        yield put(actions.updateState({
          ticket: {
            visible: true,
            // 列表
            list: first.ticket_list.map((ticket) => ({
              name: ticket.name,
              desc: {
                useLimit: ticket.desc.use_limit,
                discount: ticket.desc.discount,
              },
            })),
            titleText1: '恭喜获得优惠券',
            titleText2: '',
            buttonText: '去看看',
            path: '/mine/myTickets',
          },
        }));
      } else if (first.scene_type === 'reward_ticket') {
        yield put(actions.updateState({
          ticket: {
            visible: true,
            // 列表
            list: first.ticket_list.map((ticket) => ({
              name: ticket.name,
              desc: {
                useLimit: ticket.desc.use_limit,
                discount: ticket.desc.discount,
              },
            })),
            titleText1: '恭喜完成任务',
            titleText2: '获得优惠券',
            buttonText: '去看看',
            path: '/mine/myTickets',
          },
        }));
      } else if (first.scene_type === 'reward_membercard') {
        yield put(actions.updateState({
          memberCard: {
            visible: true,
            // 列表
            list: first.membercard_list.map((m) => ({
              title: m.title,
              expireTime: m.expire_time,
            })),
            path: '/memberCard/detail',
            params: {
              membercard_id: first.membercard_id,
            },
          },
        }));
      } else if (first.scene_type === 'pop_image') {
        yield put(actions.updateState({
          image: {
            // 入口 显示 || 隐藏
            visible: true,
            // 图片（比如证书）
            picUrl: first.image,
          },
        }));
      }
    },
  },

  subscriptions: {
    // 监控路由变化，获取popup list
    setupHistory({ dispatch, history }) {
      let lastCheckTime = Date.now();

      if (Date.now() - lastCheckTime > 1000
        && (window.location.pathname === '/index'
          || window.location.pathname === '/'
          || window.location.pathname === '/teachingPlan'
          || window.location.pathname === '/course/product')
      ) {
        dispatch({ type: 'checkPopMessage', payload: { refresh: true } });
      }

      history.listen((location) => {
        if (Date.now() - lastCheckTime > 1000
          && (location.pathname === '/index'
            || location.pathname === '/'
            || location.pathname === '/teachingPlan'
            || location.pathname === '/course/product')
        ) {
          // 检查popuplist
          lastCheckTime = Date.now();
          dispatch({ type: 'checkPopMessage', payload: { refresh: true } });
        }
      });
    },
  },
});
