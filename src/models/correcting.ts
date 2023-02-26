import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import actions from 'actions';
// import api from 'api';

// const {
// } = api;

interface IRemarkFile {
  type: 'image' | 'audio' | 'video',
  url: string | null,
  fileObject: any,
}
// 后续移动回correction/models下
export default modelExtend(model, {
  namespace: 'correcting',

  state: {
    // 当前选中的文件
    remarkFileList: [],
  },

  reducers: {},

  effects: {
    * imageUploaded({ payload: { files } }, { call, select, put }) {
      const remarkFileList = yield select((s) => (s.correcting.remarkFileList));

      console.log('imageUploaded', remarkFileList, files, '返回的数据');

      const newRemarkFileList = [].concat(remarkFileList).concat(files.map(
        (file: IRemarkFile, index) => ({ type: 'image', url: file.url, fileObject: file.fileObject }),
      ));
      yield put(actions.updateState({ remarkFileList: newRemarkFileList }));
    },

    * videoUploaded({ payload: { files } }, { call, select, put }) {
      const remarkFileList = yield select((s) => (s.correcting.remarkFileList));

      console.log('videoUploaded', remarkFileList, files);

      const newRemarkFileList = [].concat(remarkFileList).concat(files.map(
        (file: IRemarkFile, index) => ({ type: 'video', url: file.url, fileObject: file.fileObject }),
      ));
      yield put(actions.updateState({ remarkFileList: newRemarkFileList }));
    },

    * audioUploaded({ payload: { files } }, { call, select, put }) {
      const remarkFileList = yield select((s) => (s.correcting.remarkFileList));

      console.log('audioUploaded', remarkFileList, files);

      const newRemarkFileList = [].concat(remarkFileList).concat(files.map(
        (file: IRemarkFile, index) => ({ type: 'audio', url: file.url, fileObject: file.fileObject }),
      ));
      yield put(actions.updateState({ remarkFileList: newRemarkFileList }));
    },

    // 清空
    * clear(_, { put }) {
      yield put(actions.updateState({
        remarkFileList: [],
      }));
    },

    // 删除指定url的资源
    * removeByUrl({ payload: { url } }, { select, put }) {
      const remarkFileList: [] = yield select((s) => (s.correcting.remarkFileList));
      yield put(actions.updateState({
        remarkFileList: remarkFileList.filter((item: any) => item.url === url),
      }));
    },
  },
});
