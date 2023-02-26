import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import api from 'api';
import { delay } from 'utils/utils';
import weixin from 'common/weixin';
import actions from 'actions';

import { IWeixin } from './types';

const {
  getObjectPathList,
  getJssdkConfig,
} = api;

// 控制批量查询objectPath的队列
let queryQueue: any[] = [];

const IS_DEBUG = false;
const testRecords = {
  course_detail_9de79722a222954b91ddd66ab1fd59eb_68c906e60a4ba7c1b48d5cdeee05cb9e: {
    app_id: 'wx3bcc4c58d9660682',
    path: 'pages/course/course-detail/coursedetail?client_id=067eb0e8d52a4c78151acee21842f363&course_id=63db69f884f3b4147edae1851d205a23&singlecourse_id=68c906e60a4ba7c1b48d5cdeee05cb9e',
    path_type: 'course_detail',
    web_url: 'course/product/?course_id=9de79722a222954b91ddd66ab1fd59eb&cid=c4d596e1d8b1bcda64781f05da2a92fd',
    wxacode_image: 'https://testqiniu.beautifulreading.com/369796c2a3471e655fbd3e5990c1b771?sign=211825047b988aa3071d0998828e31b1&t=6006384e',
  },
};

function checkWxInitStatus() {
  return new Promise<void>((resolve, reject) => {
    wx.ready(() => resolve());
    wx.error((err) => reject(err));
  });
}

export default modelExtend(model, {
  namespace: 'weixin',
  state: {
    // 跳转记录, key是type + '_' + objectIds
    jumpRecords: IS_DEBUG ? testRecords : {},

    // 标识完成初始化微信的JS SDK
    isJssdkConfigReady: false,

    // 公众号原始ID
    // username: '',

    // jumpId
    // jumpId: '',
  } as IWeixin,

  reducers: {
  },

  effects: {
    /**
     * 带跳转的组件，初始化时需要调用此方法，获取跳转信息
     */
    * pullJumpRecord({ payload: { type, objectIds } }, { call, select, put }) {
      if (!type) {
        // 非法参数
        return;
      }

      const jumpRecords = yield select((state) => state.weixin.jumpRecords);
      const isLogin = yield select((state) => state.user.isLogin);
      const key = weixin.genJumpRecordKey(type, objectIds, isLogin);
      const record = jumpRecords[key];
      if (record) {
        // 已存在
        return;
      }

      // 先加入待查询队列
      if (queryQueue.find((query) => query.key === key)) {
        // 已经在队列中
        return;
      }

      queryQueue.push({
        type,
        objectIds,
        key: weixin.genJumpRecordKey(type, objectIds, isLogin),
      });

      if (queryQueue.length === 1) {
        // 1秒内的一起处理
        yield call(delay, 300);

        if (queryQueue.length > 0) {
          const queryQueueToSend: any[] = queryQueue;
          queryQueue = [];
          // 调用批量获取接口
          const { head: { code, msg }, data } = yield call(getObjectPathList, {
            path_list: queryQueueToSend.map((item) => ({
              path_type: item.type,
              object_ids: item.objectIds,
            })),
          });

          if (code === 200) {
            // 把结果写入state
            const newJumpRecords = {
              ...jumpRecords,
            };

            data.forEach((elem) => {
              const errCodes: any = [];
              if (elem.wxacode_error_detail && elem.wxacode_error_detail.errcode) {
                errCodes.push(elem.wxacode_error_detail.errcode);
              }

              if (elem.openlink_error_detail && elem.openlink_error_detail.errcode) {
                errCodes.push(elem.openlink_error_detail.errcode);
              }
              newJumpRecords[weixin.genJumpRecordKey(elem.path_type, elem.object_ids, isLogin)] = {
                pathType: elem.path_type,
                appId: elem.app_id,
                path: elem.path,
                webUrl: elem.web_url,
                wxacodeImage: elem.wxacode_image,
                openlink: elem.openlink,
                userName: elem.user_name,
                errCodes,
              };
            });

            yield put.resolve(actions.updateState({ jumpRecords: newJumpRecords }));
            console.log('WEIXIN ADD RECORD', yield select((state) => state.weixin));
          } else {
            console.error(code, msg);
          }
        }
      }
    },

    /**
     * 跳转控件点击时，触发的跳转（针对非微信浏览器）
     */
    * jump({ payload: { type, objectIds } }, { call, select, put }) {
      let jumpRecords = yield select((state) => state.weixin.jumpRecords);
      const isLogin = yield select((state) => state.user.isLogin);
      const key = weixin.genJumpRecordKey(type, objectIds, isLogin);
      let record = jumpRecords[key];
      if (!record) {
        yield put(actions.showLoading('加载中'));
        // 延迟一秒后重试
        for (let i = 0; i < 10; i += 1) {
          yield call(delay, 1000);
          jumpRecords = yield select((state) => state.weixin.jumpRecords);
          record = jumpRecords[key];
          if (record) {
            break;
          }
        }
        yield put(actions.hideLoading());
        if (!record) {
          console.error('获取不到跳转记录', type, objectIds);
          return;
        }
      }

      const browser = yield select((state) => state.browser);
      if (!browser.isWeixinBrowser) {
        if (browser.isMobileBrowser) {
          if (!record.openlink && !record.wxacodeImage) {
            yield put(actions.toastFail(`点击无效（错误码：${record.errCodes.join('，')}），请联系客服解决`));
          } else {
            if (record.wxacodeImage) {
              // 设置已弹窗
              yield put.resolve(actions.updateState({ isPopup: true }));
              // 弹出小程序码
              yield put.resolve(actions.popup.showCard(
                record.wxacodeImage,
                browser.isMobileBrowser ? '长按保存小程序码，扫码打开小程序' : '右键保存小程序码，扫码打开小程序',
                { type: 'weixin/updateState', payload: { isPopup: false } },
              ));
            }

            // 尝试跳转
            if (record.openlink) {
              window.location.href = record.openlink;
            }
          }
        } else if (!record.wxacodeImage) {
          yield put(actions.toastFail(`点击无效（错误码：${record.errCodes.join('，')}），请联系客服解决`));
        } else {
          // 弹出小程序码
          yield put(actions.popup.showCard(record.wxacodeImage, browser.isMobileBrowser ? '长按保存小程序码，扫码打开小程序' : '右键保存小程序码，扫码打开小程序'));
        }
      }
    },

    /**
     * 初始化微信的JS SDK
     */
    * initJsSdk(action, {
      call, select, put, fork,
    }) {
      // 参考文档：
      // https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#3

      const { isWeixinBrowser, isMobileBrowser } = yield select((state) => state.browser);

      // 非微信浏览器、pc端不用处理
      if (!isWeixinBrowser || !isMobileBrowser) {
        return;
      }

      const cid = yield select((state) => state.client.cid);
      const { head: { code, msg }, data } = yield call(getJssdkConfig, {
        client_id: cid,
        url: window.location.href,
      });

      if (code === 200) {
        // 保存username
        // yield put(actions.updateState({ username: data.user_name }));
        // eslint-disable-next-line no-undef
        wx.config({
          // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          debug: false,
          // 必填，公众号的唯一标识
          appId: data.app_id,
          // 必填，生成签名的时间戳(必须是字符串类型,否则真机会config:fail)
          timestamp: `${data.timestamp}`,
          // 必填，生成签名的随机串
          nonceStr: data.noncestr,
          // 必填，签名
          signature: data.signature,
          // 必填，需要使用的JS接口列表(至少要填一个，不然安卓会报config:param is empty)
          jsApiList: ['chooseImage', 'startRecord', 'stopRecord', 'uploadVoice', 'updateAppMessageShareData', 'updateTimelineShareData'],
          // 开放标签
          openTagList: ['wx-open-launch-weapp'],
        });

        try {
          yield call(checkWxInitStatus);
          yield put(actions.updateState({ isJssdkConfigReady: true }));
        } catch (err) {
          yield put(actions.toastFail('JS SDK 初始化失败'));
        }
      } else {
        console.error('initJsSdk', msg);
      }
    },

    /**
     * 隐藏弹出框
     */
    * hidePopup(action, { select, put }) {
      const isPopup = yield select((s) => (s.weixin.isPopup));
      if (isPopup) {
        yield put(actions.popup.hideCard());
        yield put(actions.updateState({ isPopup: false }));
      }
    },
  },

  subscriptions: {
    setup({ dispatch }) {
      document.addEventListener('visibilitychange', () => {
        dispatch({ type: 'hidePopup' });
      });
    },
  },
});
