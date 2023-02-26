/**
 * 上传文件
 * @param type 类型: audio, video, image
 * @param filePaths 本地文件路径数组
 * @param onUploaded 上传成功的事件dispatch
 */
const uploadFile = (type, filePaths, onUploaded) => ({
  type: 'upload/uploadFile',
  payload: {
    type,
    filePaths,
    onUploaded,
  },
});

/**
 * 上传微信素材
 * @param type 类型: audio, video, image
 * @param localId 素材本地ID
 * @param onUploaded 上传成功的事件dispatch
 */
const uploadWxFile = (type, localId, onUploaded) => ({
  type: 'upload/uploadWxFile',
  payload: {
    type,
    localId,
    onUploaded,
  },
});

export default {
  uploadFile,
  uploadWxFile,
};
