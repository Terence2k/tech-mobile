export default {
  joinFlag: 'n',
  headerData: {},
  trialContent: {
    title: '试看内容',
    nodeList: [
      {
        node: [],
      },
    ],
  },
  // 底部栏
  submitBar: {
    // 是否禁用状态
    disabled: false,
    // 分享
    share: {
      // 入口文案
      label: '分享',
    },
    // 收藏
    edit: {
      // 入口文案
      label: '发帖子',
      show: true,
    },
    // 编辑
    collect: {
      // 入口文案
      label: '收藏',
      show: true,
      value: 'y',
    },
    // 提交订单栏
    menus: [
      {
        // 正价
        mode: 'blue',
        type: 'default',
        label: '免费获取',
      },
    ],
  },
  // components/productTicketList 优惠券（通用）
  productTicketList: {
    name: '',
    list: [],
  },
  // 资料列表
  fileList: {
    title: '资料标题',
    list: [],
  },
  // 伴奏列表
  audioList: {
    title: '伴奏标题',
    list: [],
  },
};
