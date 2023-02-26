export default {
  // 是否已过期
  expireFlag: 'n',
  // 价格
  price: 0,
  // 描述
  desc: '',
  // 会员卡信息
  cardDetail: {
    title: '',
    desc: [],
    background: '',
    price: 0,
    originalPrice: 0,
    period: 0,
    color: '',
    // 用户信息
    subtitle: '',
    userName: '',
    userImage: '',
  },
  // 会员权益
  isMemberDesc: [],
  // 非会员权益
  notMemberDesc: [],
  // 免费的课程
  freeCourseList: [],
  freeCourseCount: 0,
  // 免费的直播
  freeLiveCourseList: [],
  freeLiveCourseCount: 0,
  // 免费的打卡
  freeDakaList: [],
  freeDakaCount: 0,

  // 折扣的课程
  discountCourseList: [],
  discountCourseCount: 0,
  // 折扣的直播
  discountLiveCourseList: [],
  discountLiveCourseCount: 0,
  // 折扣的打卡
  discountDakaList: [],
  discountDakaCount: 0,

  // 弹窗标题
  popupTitle: '',
  // 弹窗列表
  popupList: [],
  // 弹窗内容总数
  popupCount: 0,
  // 弹窗页码
  popupPage: 0,
  // 弹窗loading
  popupLoading: false,
  // 显示弹窗
  showPopup: false,
  // 当前使用的接口
  currentFunc: () => {},
  // 当前类型
  currentType: '',
  // 生成当前跳转参数
  jumpPath: '',
  jumpField: () => {},
};
