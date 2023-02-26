import moment from 'moment';
import { Toast } from 'antd-mobile';

export const platform = (() => {
  const UA = window.navigator.userAgent;
  const isAndroid = /android|adr/gi.test(UA);
  const isIos = /iphone|ipod|ipad/gi.test(UA) && !isAndroid; // 据说某些国产机的UA会同时包含 android iphone 字符
  const isMobile = isAndroid || isIos; // 粗略的判断
  return {
    isAndroid,
    isIos,
    isMobile,
    isNewsApp: /NewsApp\/[\d.]+/gi.test(UA),
    isWeixin: /MicroMessenger/gi.test(UA),
    isQQ: /QQ\/\d/gi.test(UA),
    isYixin: /YiXin/gi.test(UA),
    isWeibo: /Weibo/gi.test(UA),
    isTXWeibo: /T(?:X|encent)MicroBlog/gi.test(UA),
    isMiniProgram: /miniProgram/gi.test(UA),
  };
})();

export const getParams = (res = '') => {
  const params = {};
  const vars = decodeURIComponent(res).split('&');

  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split('=');
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
};

export const delay = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

export const chineseWeek = (time) => {
  const week = moment(time).format('d');
  let value = '';

  switch (Number(week)) {
    case 0:
      value = '周日';
      break;
    case 1:
      value = '周一';
      break;
    case 2:
      value = '周二';
      break;
    case 3:
      value = '周三';
      break;
    case 4:
      value = '周四';
      break;
    case 5:
      value = '周五';
      break;
    case 6:
      value = '周六';
      break;

    default:
      break;
  }

  return value;
};

// 时长转换
export const formatDuration = (time) => {
  let hours: any = parseInt((time / 3600).toString());
  let minutes: any = (time % 3600) / 60;
  if (hours < 10) hours = `0${hours}`;
  if (minutes < 10) minutes = `0${minutes}`;

  return `${hours}时${minutes}分`;
};

export const strArrayToObject = (array) => array.reduce((accumulator, currentValue, i) => {
  accumulator[currentValue] = currentValue;
  return accumulator;
}, {});

// 复制到剪贴板
export const copyToClip = (content, message) => {
  const aux = document.createElement('input');
  aux.setAttribute('value', content);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand('copy');
  document.body.removeChild(aux);
  if (message == null) {
    Toast.info('内容已复制');
  } else {
    Toast.info(message);
  }
};

// 获取文件扩展名
export const getFileExtension = (path) => {
  if (typeof path === 'string') {
    const splitPathRe = /^(\/?)([\s\S]*?)((?:\.{1,2}|[^\/]+?)(\.([^\.\/\?]+)))(?:[\/]*|[\?].*)$/;
    const pathParts = splitPathRe.exec(path);

    if (pathParts) {
      return pathParts.pop().toLowerCase();
    }
  }
  return '';
};
