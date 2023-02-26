import VConsole from 'vconsole';

import Video from 'video.js';
/* 不能直接引入js，否则会报错：videojs is not defined
import 'video.js/dist/lang/zh-CN.js' */
// @ts-ignore
import videoZhCN from 'video.js/dist/lang/zh-CN.json';
// @ts-ignore
import videoEn from 'video.js/dist/lang/en.json';
import 'video.js/dist/video-js.css';

Video.addLanguage('zh-CN', videoZhCN);
Video.addLanguage('en', videoEn);

if (process.env.UMI_ENV !== 'prod') {
  const vConsole = new VConsole();
  vConsole.setOption({ maxLogNumber: 5000 });
}

// console.log('app.ts isDevelopment', isDevelopment)
// console.log('app.ts window.location', window.location)

// eslint-disable-next-line import/prefer-default-export
export const dva = {
  config: {
    initialState: {
      // appdvavalue: '这是全局值'
    },
    onError(err: ErrorEvent) {
      err.preventDefault();
      console.error(err);
    },
  },
};
