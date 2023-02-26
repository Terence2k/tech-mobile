export default {
  // 顶部tab
  tabs: [
    { title: '热销会员卡' },
    { title: '我的会员卡' },
  ],
  page: 0,

  hasPage: 0,
  hasCount: 0,
  // 已拥有会员卡
  hasList: [],

  allPage: 0,
  allCount: 0,
  // 所有会员卡
  memberCardList: [],

  list: [
    { label: '使用中', id: 'valid' },
    { label: '已过期', id: 'expire' },
    { label: '已失效', id: 'invalid' },
  ],
  status: 'valid',
};
