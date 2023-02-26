export interface IBrowser {
  // 是否微信浏览器
  isWeixinBrowser: boolean;

  // 是否移动端浏览器
  isMobileBrowser: boolean;

  // 是否在小程序内
  isMiniProgramBrowser: boolean,

  // 当前url的路径
  locationPathname: string;

  // 当前url的query值
  locationQuery: { [key: string]: any };

  // 预先生成的指向当前页面的重定向链接，方便其他模块需要带重定向参数时使用
  redirectStrToCurrentPage: string;

  // 终端类型
  terminalType: string;

  // 最近是否有popState, 用于长列表界面判断是否需要重新加载列表数据，便于浏览器回退时，保持列表的scroll位置
  isJustPopState: boolean,
}

export interface IClient {
  // 店铺id
  cid: string | null;

  // 店铺logo
  logo: string,

  // 店铺名字
  name: string,

  // 店铺是否认证（关联第三方小程序)
  authorized: string | null;

  // 小程序ID
  appId: string | null;

  // 小程序配置
  miniConfig: any;

  // 权限列表
  miniResourceList: string[];

  // 小程序信息
  clientInfoM: {
    closed?: boolean,
    // eslint-disable-next-line camelcase
    is_expire?: boolean,
    [key: string]: any,
  } | null;

  // 分享对话框信息
  shareInfo: { [key: string]: any } | null;

  // tabs
  tabPaths: string[];
  tabbar: { [key: string]: any }[];
}

export interface IPopup {

  // 分享底部弹出的菜单
  shareMenu: {
    menus: {
      [index: number]: {
        label: string,
        type: string,
      }
    },
    visible: boolean,
    sharePicUrl: string,
  }

  // 海报弹框
  card: {
    visible: boolean,
    picUrl: string,
    tip: string,
  },

  // 二维码
  qrCode: {
    visible: boolean,
    link: string,
    tip: string,
    onHideHandler: object | null,
  },

  // 图片弹框
  image: {
    visible: boolean,
    // 图片（比如证书）
    picUrl: string,
  },

  // 会员卡弹框
  memberCard: {
    visible: boolean,
    // 列表
    list: {
      [index: number]: {
        title: string,
        expireTime: number,
      }
    },
    path: string,
    params: { [key: string]: any },
  },

  // 优惠券弹
  ticket: {
    visible: boolean,
    // 列表
    list: {
      [index: number]: {
        name: string,
        desc: {
          useLimit: string,
          discount: string,
        }
      }
    },
    path: string,
    titleText1: string,
    titleText2: string,
    buttonText: string,
  },

  // 预览图片
  previewPicture: {
    visiable: boolean,
    url: any,
  },
  // 预览视频
  previewView: {
    visiable: boolean,
    url: any,
  },
}
export interface IUser {
  // 微信OAuth的token
  otoken: string | null,

  // 手机号登录的token
  mtoken: string | null,

  // 用户ID
  userId: string | null,

  // 用户浏览器session
  brSession: string | null,

  // 是否登录
  isLogin: boolean,

  // 用户手机号
  mobileNumber: string,

  // 昵称
  nickname: string,

  // 头像
  headImgUrl: string,

  // 是否为老师
  isTeacher: boolean,
}

export interface IWeixin {
  // 跳转记录, key是type + '_' + objectIds
  jumpRecords: {
    [key: string]: {
      pathType: string,
      appId: string,
      path: string,
      webUrl: string,
      wxacodeImage: string,
    }
  },

  // 标识完成初始化微信的JS SDK
  isJssdkConfigReady: boolean,

  // 公众号原始ID
  // username: string,

  // jump id (跳转小程序的链接都需要带上)
  // jumpId: string,
}

export interface ITicketItem {
  ticketId: string,
  clientId: string,
  name: string,
  scopeType: number,
  useLimit: number,
  type: number,
  discount: number,
  totalNum: number,
  receiveNum: number,
  receiveDateBegin: string,
  receiveDateEnd: string,
  expireType: number,
  limitDay: number,
  receiveLimit: number,
  receiveWay: number,
  receiveRule: string,
  status: number,
  deleteStatus: number,
  createTime: string,
  updateTime: string,
  productList?: string[],
  desc: {
    useLimit: string,
    discount: string,
    scopeType: string,
    instruction: string,
    time: string,
  },
  isReceived: boolean,
  isToLimit: boolean,
}

export interface IUserTicketItem extends ITicketItem {
  userId: string,
  userTicketId: string,
}

export interface ITicket {
  // 商品相关的优惠券列表
  productTicketInfo: {
    popupVisible: boolean,
    productId: string,
    // 可领取
    ticketList: ITicketItem[],
    // 已领取
    receivedTicketList: IUserTicketItem[],
  },

  // 选择优惠券（已经领取的）
  availableTicketInfo: {
    popupVisible: boolean,
    // 当前选择
    value: string,
    // 列表
    list: IUserTicketItem[],
  },
}

export interface IProductInfo {
  productId: string,
  paramDetailId: string,
  num: number,
}

export type TState = {
  browser: IBrowser,
  client: IClient,
  popup: IPopup,
  ticket: ITicket,
  user: IUser,
  weixin: IWeixin,
  [key: string]: any,
}
