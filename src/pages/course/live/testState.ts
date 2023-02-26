import { Toast } from 'antd-mobile';

export default {
  // 封面
  coverList: [
    {
      type: 'image',
      url: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
    },
  ],
  // 直播标题
  title: '性感派大星在线直播性感派大星在线直播性感派大星在线直播',
  // 直播状态
  liveStatus: {
    text: '直播中',
    value: 'doing',
    effect: 'custom',
    style: {
      background: '#0F8FFF',
      color: '#FFF',
      marginLeft: '15px',
    },
  },
  // components/productPrice（通用）
  livePrice: {
    // 价格
    price: 999.00,
    // 划线格
    originalPrice: 1000.00,
    // 免费
    // free: true,
  },
  // components/countStat 统计数据（通用）
  countStat: {
    list: ['已报名 {joinCount}'],
  },
  // 直播简介
  liveDesc: {
    // 简介
    desc: '简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容...',
  },
  // 直播授课老师
  teachers: {
    name: '授课老师',
    list: [
      {
        // 头像
        headimgurl: 'https://workbest.top/Public/headimg/201730/9bf5285203b927b84d8c65e6516c5441.jpg',
        // 昵称
        nickname: '昵称昵称',
        // 是否主讲
        mainTeacher: 'y',
        // 主讲介绍
        intro: '主讲介绍主讲介绍主讲介绍主讲介绍主讲介绍主讲介绍主讲介绍主讲介绍主讲介绍主讲介绍主讲介绍主讲介绍主讲介绍主讲介绍...',
      },
      {
        // 头像
        headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
        // 昵称
        nickname: '昵称昵称昵称昵称昵称昵称昵称昵称',
      },
      {
        // 头像
        headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
        // 昵称
        nickname: '昵称昵称',
      },
      {
        // 头像
        headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
        // 昵称
        nickname: '昵称昵称',
      },
      {
        // 头像
        headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
        // 昵称
        nickname: '昵称昵称',
      },
      {
        // 头像
        headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
        // 昵称
        nickname: '昵称昵称',
      },
      {
        // 头像
        headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
        // 昵称
        nickname: '昵称昵称',
      },
      {
        // 头像
        headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
        // 昵称
        nickname: '昵称昵称',
      },
    ],
  },
  // 资料列表
  fileList: [
    {
      title: '资料资料资料资料资料资料资料资料资料资料资料资料资料资料资料资料',
      extension: 'doc',
      download_flag: 'y',
    },
    {
      title: '资料资料资料资料资料资料资料资料资料资料资料资料资料资料资料资料',
      extension: 'zip',
      download_flag: 'y',
    },
  ],
  // tab
  tabArr: [
    { title: '课程内容' },
    { title: '课程任务' },
  ],
  activeTab: 0,
  // 富文本内容
  liveMediaList: [
    {
      node: [
        {
          type: 'text',
          attrs: {},
          html: '<strong><span style="color: #548DD4;">左对齐</span></strong>',
          text: '左对齐',
        },
        {
          type: 'text',
          attrs: {
            style: 'text-align: center;',
          },
          html: '居中对齐',
          text: '居中对齐',
        },
        {
          type: 'image_ad',
          subEntry: [
            {
              imageUrl: 'https://qcdn.beautifulreading.com/upload_files/2019/12/18/28a7bb22de769fb6bb3935287b2eb2b4.png',
              width: 1200,
              height: 773,
            },
          ],
        },
      ],
    },
  ],
  // 作业列表
  homeworkList: [
    {
      title: '作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业作业',
      // postCount: 0,
      // viewCount: 0,
      questionCount: 0,
      handinCount: 0,
    },
  ],
  // 底部栏
  liveSubmitBar: {
    // 是否禁用状态
    disabled: false,
    // disabled为true时需要
    disabledText: '活动已结束',
    // 分享
    share: {
      // 入口文案
      label: '分享',
    },
    // 提交订单栏
    menus: [{
      // 开能会员卡
      mode: 'black',
      type: 'membercard',
      label: '开通会员享优惠',
    }, {
      // 正价
      mode: 'blue',
      type: 'default',
      label: '立即购买',
    }],
  },
  // 收藏状态
  liveFavorites: {
    favoriteFlag: 'y',
  },
  // 距离直播开始时间
  liveRestTime: 100,
  // 是否显示弹窗
  popupVisible: false,
  // 弹窗信息
  popupData: {
    data: {
      title: '进入直播间',
      content: '<p>复制观看链接从电脑浏览器打开，输入观看码可在电脑观看。</p><p>观看链接：https://wiki.beautifulreading.com</p><p>观看码：268568</p>',
    },
    operations: [
      {
        text: '手机观看',
        payload: '打开小程序',
        onClick: (payload) => {
          Toast.info(payload);
        },
      },
      {
        text: '复制链接',
        payload: '复制链接',
        style: {
          color: '#409EFF',
          fontWeight: '600',
        },
        onClick: (payload) => {
          Toast.info(payload);
        },
      },
    ],
  },
  // components/productTicketList 优惠券（通用）
  productTicketListData: {
    name: '',
    list: [{
      ticketId: 'b270595bee49146fb222e9c8e94470f5',
      name: '春季会员优惠',
      useLimit: 0,
      type: 1,
      discount: 9.9,
      desc: '9.9折,无门槛',
    }, {
      ticketId: 'b270595bee49146fb222e9c8e94470f5',
      name: '夏季会员优惠',
      useLimit: 0,
      type: 1,
      discount: 9.9,
      desc: '8.9折,无门槛',
    }],
  },
  // 密码
  password: '',
  // 密码框显示
  passwordShow: false,
  // 商品ID
  productId: '',
  // 是否已加入
  joinFlag: '',
  // livecourse id
  liveCourseId: '',
};
