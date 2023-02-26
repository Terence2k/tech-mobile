import isEqual from 'lodash.isequal';
import { IShare } from '@/utils/model';

/**
 * @param type 页面类型
 * @param objectIds 参数
 * @param isLogin 是否已登录（两者拿到的record不一样）
 * @see https://showdoc.beautifulreading.com/web/#/7?page_id=2641
 */
function genJumpRecordKey(type: string, objectIds: object, isLogin: boolean) {
  const ids = objectIds;
  Object.keys(ids).forEach((key) => ids[key] === undefined && delete ids[key]);
  const keys = Object.keys(ids).sort();
  return `${isLogin ? 'login' : 'noLogin'}_${type}${keys.map((key) => `${key}_${ids[key]}`).join('_')}`;
}

// 公众号授权
function authorize(redirect: string, authorized: string, appId: string) {
  const hostname = 'https://open.beautifulreading.com';
  let redirectUri = `${hostname}/${GLOBAL_CONFIG.BASE_PATH}/login`;
  if (redirect) {
    redirectUri += `?redirect=${encodeURIComponent(redirect)}`;
  }
  let jumpUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=snsapi_userinfo`;

  if (authorized && authorized === 'y') {
    // 当前店铺已经第三方授权。添加字段component_appid
    jumpUrl += `&component_appid=${GLOBAL_CONFIG.COMPONENT_APPID}`;
  }

  jumpUrl += '#wechat_redirect';

  window.location.href = jumpUrl;
}

// 当前配置的分享信息
let shareMessage: IShare;

// 分享
function updateShareData(res = {}) {
  if (shareMessage && isEqual(shareMessage, res)) return;

  const options = {
    title: '', // 分享标题
    desc: '', // 分享描述
    link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: '', // 分享图标
    ...res,
  };

  const params = (new URL(options.link)).searchParams;
  if (params.toString()) {
    if (!params.has('wxshare')) {
      options.link += '&wxshare=y';
    }
  } else {
    options.link += '?wxshare=y';
  }

  // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
  wx.updateAppMessageShareData({
    ...options,
    success() {
      // 设置成功
      console.info('【成功】 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）', JSON.stringify(res, null, 4));
      shareMessage = { ...res } as IShare;
    },
  });

  // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
  wx.updateTimelineShareData({
    ...options,
    success() {
      // 设置成功
      console.info('【成功】 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）', JSON.stringify(res, null, 4));
      shareMessage = { ...res } as IShare;
    },
  });
}

export default {
  genJumpRecordKey,
  authorize,
  updateShareData,
};
