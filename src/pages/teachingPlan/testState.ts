export default {
  // 顶部tab
  tabs: [
    { title: '课程' },
    { title: '大纲' },
    { title: '详情' },
  ],
  page: 0,
  // 展开节点
  activeKey: [],
  // 是否加入方案
  joinFlag: 'y',
  // 主题颜色
  themeColor: '#F5222D',
  // 头部轮播图
  coverList: [
    {
      type: 'image',
      url: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
    },
    {
      type: 'image',
      url: 'https://qcdn.beautifulreading.com/upload_files/2020/04/15/c785810835e1e816a4b5ed50acad3406.jpeg',
    },
    {
      type: 'video',
      url: 'https://qcdn.beautifulreading.com/upload_files/2020/09/29/5a4c0f086e7c719763d9188a855d2167.mp4',
      duration: 15,
    },
  ],
  // 方案数据
  title: '教学方案教学方案教学方案教学方案教学方案,',
  timeText: '8月15日-10月40日',
  itemCount: 3,
  studyCount: 10,
  price: {
    price: 100,
    originalPrice: 1000,
  },
  // 是否展示学习人数
  showStudyCount: 'y',
  // 方案特点
  featuresList: ['蟹黄堡', '海绵鲍勃', 'key'],
  // 方案卖点
  sellPoints: ['蟹黄堡的秘密配方', '痞老板刚刚发现的plan z', '珊迪的橡树屋在圣诞节'],
  // 授课老师
  teachers: {
    name: '授课老师',
    list: [
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
  // components/productTicketList 优惠券（通用）
  productTicketList: {
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
  // 底部栏
  submitBar: {
    // 分享
    share: {
      // 入口文案
      label: '分享',
    },
    // 提交订单栏
    menus: [
      {
        // 正价
        mode: 'custom',
        background: '#F5222D',
        type: 'default',
        label: '立即报名',
      },
    ],
  },

  // 节点列表
  itemList: [
    {
      item_id: '1',
      show_index: 1,
      content_list: [
        {
          title: '预习200',
          content_type: 'prepare',
          object_type: 200,
          lock_status: 'y',
          study_status: 'done',
        },
        {
          title: '核心核心核心核心核心核心核心核心核心核心',
          content_type: 'kernel',
          object_type: 200,
          object_id: '1',
          lock_status: 'y',
          study_status: 'done',
          study_duration: 0,
          teacher: {
            headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/7eb373b964bdb01a13a436a5792266b6.jpg',
            nickname: '谷',
          },
        },
        {
          content_type: 'review',
          object_type: 200,
          lock_status: 'y',
          study_status: 'done',
          task_list: [
            {
              type: 'set',
              exampaper_set_title: '作业集',
              status: 'wait',
            },
            {
              type: 'reservation',
              title: '预约预约预约',
              status: 'wait',
              start_time: 1608566400000,
              end_time: 1608566400000,
            },
            {
              type: 'paper',
              paper_title: '考试考试考试考试考试考试考试考试考试考试考试考试考试考试考试考试考试考试考试考试考试',
              status: 'wait',
              start_time: 1608566400000,
              end_time: 1608566400000,
              exampaper_score: 100,
            },
          ],
        },
      ],
    },
    {
      item_id: '2',
      show_index: 2,
      content_list: [
        {
          title: '预习200',
          content_type: 'prepare',
          object_type: 200,
          lock_status: 'y',
          study_status: 'done',
        },
        {
          title: '核心核心核心核心核心核心核心核心核心核心核心核心核心核心核心核心核心核心核心核心',
          content_type: 'kernel',
          object_type: 321,
          lock_status: 'y',
          study_status: 'done',
          object_id: '1',
          reservation_end_time: 1612108799999,
          reservation_start_time: 1609084800000,
        },
      ],
    },
    {
      item_id: '3',
      show_index: 3,
      content_list: [
        {
          title: '预习200',
          content_type: 'prepare',
          object_type: 200,
          lock_status: 'y',
          study_status: 'done',
        },
        {
          title: '核心核心核心核心核心核心核心核心核心核心',
          content_type: 'kernel',
          object_type: 312,
          lock_status: 'y',
          study_status: 'done',
          object_id: '1',
          live_start_time: 1612108799999,
          live_end_time: 1609084800000,
          study_duration: 0,
          teacher: {
            headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/7eb373b964bdb01a13a436a5792266b6.jpg',
            nickname: '谷',
          },
        },
      ],
    },
  ],
  // 方案详情
  mediaList: [
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
};
