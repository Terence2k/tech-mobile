import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import actions from 'actions';
import api from 'api';
import * as qiniu from 'qiniu-js';
import md5 from 'md5';
import { delay } from 'utils/utils';

const {
  getQiniuToken,
  getAudioToken,
  getWxMediaUrl,
  get,
} = api;

export default modelExtend(model, {
  namespace: 'upload',

  state: {
  },

  reducers: {},

  effects: {
    * uploadFile({ payload: { type, filePaths, onUploaded } }, { call, put }) {
      console.log('UPLOAD FILE', 'filePaths:', filePaths);

      yield put(actions.showLoading('上传中'));

      const result = {};
      const randInt = Math.floor(Math.random() * 1614858136000);
      for (let i = 0; i < filePaths.length; i += 1) {
        const filePath = filePaths[i];

        let ext = '';
        if (filePath.name && filePath.name.indexOf('.') !== -1) {
          const nameArr = filePath.name.split('.');
          ext = `.${nameArr[nameArr.length - 1]}`;
        }

        const callback = {
          next(res) {
            // console.log('NEXT', res, i);
          },
          error(err) {
            console.error('ERROR', err, i);
            result[i] = { err };
          },
          complete(res) {
            // console.log('COMPLETE', res, i);
            result[i] = { res };
          },
        };

        if (type === 'audio') {
          // 音频流程(带mp3转码)
          const srcKey = `correction/${md5(Date.now() + randInt + i)}${ext}`;
          const {
            head: { code, msg },
            data: { token, key },
          } = yield call(getAudioToken, { srcKey });

          if (code === 200) {
            const observable = qiniu.upload(filePath, key, token, {}, {});
            observable.subscribe(callback);
          } else {
            yield put(actions.toastFail(msg));
          }
        } else {
          const key = `correction/${md5(Date.now() + randInt + i)}${ext}`;
          const {
            head: { code, msg },
            data: token,
          } = yield call(getQiniuToken, { scope_type: 'public' });

          if (code === 200) {
            const observable = qiniu.upload(filePath, key, token, {}, {});
            observable.subscribe(callback);
          } else {
            yield put(actions.toastFail(msg));
          }
        }
      }

      for (let i = 0; i < 120; i += 1) {
        yield call(delay, 1000);
        if (Object.keys(result).length === filePaths.length) {
          // 完成
          break;
        }
      }

      const files: any = [];
      for (let i = 0; i < filePaths.length; i += 1) {
        const url = `${GLOBAL_CONFIG.QINIU_CDN}/${result[i].res.key}`;
        // 获取duration
        if (type === 'audio') {
          let avinfo: any;
          for (let j = 0; j < 30; j += 1) {
            yield call(delay, 2000);
            avinfo = yield call(get, `${url}?avinfo&r=${Math.random()}`, {});
            if (avinfo && avinfo.format && avinfo.format.format_name === 'mp3') {
              break;
            }
          }
          const duration = Math.floor(parseFloat(avinfo.format.duration));
          files.push({
            url: result[i].res ? url : null,
            fileObject: filePaths[i],
            duration,
          });
        } else {
          files.push({
            url: result[i].res ? url : null,
            fileObject: filePaths[i],
          });
        }
      }

      yield put(actions.hideLoading());

      yield put({ type: onUploaded.type, payload: { ...onUploaded.payload, files } });
      console.log(filePaths, 'filePaths:');
    },

    * uploadWxFile({ payload: { type, localId, onUploaded } }, { call, put }) {
      console.log('UPLOAD WX FILE', 'localId:', localId);
      yield put(actions.showLoading('上传中'));
      let mediaId = '';
      // eslint-disable-next-line no-undef
      wx.uploadVoice({
        localId,
        isShowProgressTips: 1,
        success(res) {
          mediaId = res.serverId;
        },
      });

      for (let i = 0; i < 300; i += 1) {
        yield call(delay, 100);
        if (mediaId) {
          // 完成
          break;
        }
      }
      const { head: { code, msg }, data } = yield call(getWxMediaUrl, { media_id: mediaId });
      if (code === 200) {
        // 获取duration
        let file;
        if (type === 'audio') {
          let avinfo: any;
          for (let i = 0; i < 30; i += 1) {
            yield call(delay, 2000);
            avinfo = yield call(get, `${data.url}?avinfo&r=${Math.random()}`, {});
            if (avinfo && avinfo.format && avinfo.format.format_name === 'mp3') {
              break;
            }
          }
          const duration = Math.floor(parseFloat(avinfo.format.duration));
          file = {
            url: data.url,
            mediaId,
            duration,
          };
        } else {
          file = {
            url: data.url,
            mediaId,
          };
        }
        yield put({ type: onUploaded.type, payload: { ...onUploaded.payload, files: [file] } });
      } else {
        yield put(actions.toastFail(msg));
      }
      yield put(actions.hideLoading());
    },
  },
});
