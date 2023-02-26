/**
 * 播放媒体文件
 * @param url 播放链接
 */
const mediaPlay = (url) => ({
  type: 'media/mediaPlay',
  payload: {
    url,
  },
});

export default {
  mediaPlay,
};
