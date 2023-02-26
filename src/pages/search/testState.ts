import api from 'api';

const {
  getCourseList,
  getAllLivecourseList,
  getOpernList,
} = api;

export default {
  // 搜索类型
  types: [
    {
      title: '录播课程',
      key: '1',
      api: getCourseList,
      getJumpQuery: (id) => ({
        path: '/course/product',
        query: { course_id: id },
      }),
    },
    {
      title:
      '直播',
      key: '2',
      api: getAllLivecourseList,
      getJumpQuery: (id) => ({
        path: '/course/live',
        query: { livecourse_id: id },
      }),
    },
    // { title: '方案', key: '3' },
    // { title: '预约', key: '4' },
    // { title: '打卡主题', key: '5' },
    {
      title:
      '课件资料',
      key: '6',
      api: getOpernList,
      getJumpQuery: (id) => ({
        path: '/file/fileDetail',
        query: { opern_id: id },
      }),
    },
    // { title: '实体商品', key: '7' },
    // { title: '考试', key: '8' },
    // { title: '考级', key: '9' },
    // { title: '文章', key: '10' },
    // { title: '报名表', key: '11' },
  ],
  // 当前搜索类型
  currentType: '1',
  // 当前搜索接口
  currentFunc: getCourseList,
  // 当前内容
  getJumpQuery: (id) => ({
    path: 'course/product',
    query: { course_id: id },
  }),
  // 当前搜索文字
  title: '',
  // 搜索历史
  historyItems: [],
  // 是否处于删除状态中
  isDeleting: false,
  // 搜索结果
  list: [],

  isLoading: false,
  page: 0,
  count: 0,
  isSearching: false,
};
