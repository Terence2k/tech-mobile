/**
 * 显示Loading
 * @param msg 提示文案
 * @param duration 展示时长
 */
const showLoading = (msg: string = '加载中...', duration: number = 0) => ({ type: 'popup/loadingShow', payload: { msg, duration } });

/**
 * 隐藏Loading
 */
const hideLoading = () => ({ type: 'popup/loadingHide' });

/**
 * 弹出成功提示
 * @param msg 提示文案
 * @param duration 展示时长
 */
const toastSucc = (msg: string, duration: number = 2) => ({ type: 'popup/toastSucc', payload: { msg, duration } });

/**
 * 弹出失败提示
 * @param msg 提示文案
 * @param duration 展示时长
 */
const toastFail = (msg: string, duration: number = 2) => ({ type: 'popup/toastFail', payload: { msg, duration } });

/**
 * 展示底部分享Menu
 * @param sharePicUrl 点击分享的图片链接
 */
const showShareMenu = (sharePicUrl: string, menus: Array<Object> = []) => ({ type: 'popup/showShareMenu', payload: { sharePicUrl, menus } });

/**
 * 隐藏底部分享Menu
 */
const hideShareMenu = () => ({ type: 'popup/hideShareMenu' });

/**
 * 显示分享海报卡片
 * @param picUrl 卡片的图片
 * @param tip 卡片图片下的文案
 * @param onHideHandler 关闭触发的事件
 */
const showCard = (picUrl: string, tip: string = '长按保存海报', onHideHandler: object | null = null) => ({ type: 'popup/showCard', payload: { picUrl, tip, onHideHandler } });

/**
 * 隐藏分享海报卡片
 */
const hideCard = () => ({ type: 'popup/hideCard' });

/**
 * 显示二维码
 * @param link 二维码指向的链接
 * @param tip 二维码下面的提示文案
 * @param onHideHandler 关闭二维码触发的事件
 */
const showQrCode = (link: string, tip: string = '请扫描二维码', onHideHandler: object | null = null) => ({ type: 'popup/showQrCode', payload: { link, tip, onHideHandler } });

/**
 * 隐藏二维码
 */
const hideQrCode = () => ({ type: 'popup/hideQrCode' });

/**
 * 显示图片
 * @param
 */
const showImage = (picUrl: string) => ({ type: 'popup/showImage', payload: { picUrl } });

/**
 * 隐藏图片
 */
const hideImage = () => ({ type: 'popup/hideImage' });

/**
 * 显示会员卡弹框
 * @param memberCardListInfo
    {
      // 列表
      list: [{
        title: '会员卡',
        expireTime: 1609321763424,
      }],
      path: '/path/to/you/page',
    },
 */
const showMemberCard = (memberCardListInfo: object) => ({ type: 'popup/showMemberCard', payload: { memberCardListInfo } });

/**
 * 隐藏会员卡弹框
 */
const hideMemberCard = () => ({ type: 'popup/hideMemberCard' });

/**
 *
 * @param ticketListInfo
  {
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
    path: '/path/to/you/page',
  }
 */
const showTicket = (ticketListInfo: object) => ({ type: 'popup/showTicket', payload: { ticketListInfo } });

const showPreviewPicture = (imgURL: string) => ({ type: 'popup/showPreviewPicture', payload: { imgURL } });
const hidePreviewPicture = () => ({ type: 'popup/hidePreviewPicture' });

const showPreviewVideo = (videoURL: string) => ({ type: 'popup/showPreviewVideo', payload: { videoURL } });
const hidePreviewVideo = () => ({ type: 'popup/hidePreviewVideo' });

/**
 * 隐藏优惠券列表
 */
const hideTicket = () => ({ type: 'popup/hideTicket' });

export default {
  // Loading
  showLoading,
  hideLoading,

  // toast
  toastSucc,
  toastFail,

  // share menu
  showShareMenu,
  hideShareMenu,

  // 卡片(图+文字)
  showCard,
  hideCard,

  // 二维码（二维码+文字)
  showQrCode,
  hideQrCode,

  // 图片
  showImage,
  hideImage,

  // 会员卡弹框
  showMemberCard,
  hideMemberCard,

  // 优惠券弹框
  showTicket,
  hideTicket,

  // 预览图片
  showPreviewPicture,
  hidePreviewPicture,
  // 预览视频
  showPreviewVideo,
  hidePreviewVideo,
};
