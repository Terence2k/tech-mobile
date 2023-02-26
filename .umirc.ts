/**
 * 默认配置
 */
import { IConfig } from 'umi-types'
import { resolve } from 'path'

// ref: https://umijs.org/config/
const config: IConfig = {
  alias: {
    hooks: resolve(__dirname, './src/hooks/'),
    api: resolve(__dirname, './src/services/'),
    layouts: resolve(__dirname, './src/layouts/'),
    components: resolve(__dirname, './src/components'),
    actions: resolve(__dirname, './src/actions'),
    config: resolve(__dirname, './src/utils/config'),
    themes: resolve(__dirname, './src/themes'),
    utils: resolve(__dirname, './src/utils'),
    common: resolve(__dirname, './src/common'),
  },
  sass: {},
  treeShaking: true,
  hash: true,
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        { path: '/login', component: '../pages/login/index', title: '登录' },

        { path: '/', component: '../pages/index/index', title: '首页' },
        { path: '/index', component: '../pages/index/index', title: '首页' },

        // 录播课
        { path: '/course/list', component: '../pages/course/list/index', title: '课程分组名称' },
        { path: '/course/product', component: '../pages/course/product/index', title: '录播课程' },
        { path: '/course/live', component: '../pages/course/live/index', title: '直播详情' },
        { path: '/course/live/list', component: '../pages/course/live/list/index', title: '直播课程列表' },

        // 打卡
        { path: '/daka/list', component: '../pages/daka/list/index', title: '打卡列表' },
        { path: '/daka/product', component: '../pages/daka/product/index', title: '打卡主题' },

        // 考试
        { path: '/exam/product', component: '../pages/exam/product/index', title: '考试详情页面' },

        // 资料
        { path: '/file/list', component: '../pages/file/list/index', title: '资料列表' },
        { path: '/file/fileListInner', component: '../pages/file/fileListInner/index', title: '资料分类详情' },
        { path: '/file/fileSetInner', component: '../pages/file/fileSetInner/index', title: '资料集全部' },
        { path: '/file/fileDetail', component: '../pages/file/fileDetail/index', title: '资料详情' },
        { path: '/file/fileSetDetail', component: '../pages/file/fileSetDetail/index', title: '资料集详情' },

        // 文章
        { path: '/article', component: '../pages/article/list/index', title: '文章列表' },
        { path: '/article/detail', component: '../pages/article/detail/index', title: '文章详情' },

        // 我的
        { path: '/mine', component: '../pages/mine/index', title: '我的', Routes: ['src/wrappers/auth.tsx'] },
        { path: '/mine/info', component: '../pages/mine/mineInfo/index', title: '个人信息', Routes: ['src/wrappers/auth.tsx']  },
        { path: '/mine/infoEdit', component: '../pages/mine/mineInfoEdit/index', title: '修改昵称', Routes: ['src/wrappers/auth.tsx']  },
        { path: '/mine/order', component: '../pages/mine/mineOrder/index', title: '我的订单', Routes: ['src/wrappers/auth.tsx']  },
        { path: '/mine/orderDetail', component: '../pages/mine/mineOrderDetail/index', title: '订单详情', Routes: ['src/wrappers/auth.tsx']  },
        { path: '/mine/exchange', component: '../pages/mine/exchange/index', title: '兑换中心', Routes: ['src/wrappers/auth.tsx']  },
        { path: '/mine/myCourse', component: '../pages/mine/myCourse/index', title: '我的课程', Routes: ['src/wrappers/auth.tsx']  },
        { path: '/mine/myCollection', component: '../pages/mine/myCollection/index', title: '我的收藏', Routes: ['src/wrappers/auth.tsx']  },
        { path: '/mine/myTickets', component: '../pages/mine/myTickets/index', title: '我的优惠券', Routes: ['src/wrappers/auth.tsx']  },
        // 
        { path: '/orderPreview', component: '../pages/orderPreview/index', title: '待付款', Routes: ['src/wrappers/auth.tsx']  },
        // 
        { path: '/tabbar-packages/catalog', component: '../pages/tabbar-packages/catalog/index', title: '聚合页' },

        { path: '/ticketsCenter', component: '../pages/ticketsCenter/index', title: '领券中心' },

        // 方案
        { path: '/teachingPlan', component: '../pages/teachingPlan/index', title: '教学方案' },
        // 待批改
        { path: '/correction', component: '../pages/correction/index', title: '待批改' },

        // 预约
        { path: '/course/reservation', component: '../pages/course/reservation/index', title: '预约' },

        // 考级
        { path: '/level', component: '../pages/level/index/index', title: '成绩', Routes: ['src/wrappers/auth.tsx']  },
        { path: '/rankDetail', component: '../pages/level/rankDetail/index', title: '排行榜' },
        { path: '/themeDetail', component: '../pages/level/themeDetail/index', title: '考级主题' },
        { path: '/levelDetail', component: '../pages/level/levelDetail/index', title: '考级等级详情' },

        // 会员卡
        { path: '/memberCard', component: '../pages/memberCard/index', title: '会员卡中心' },
        { path: '/memberCard/detail', component: '../pages/memberCard/detail/index', title: '会员卡中心' },

        //
        { path: '/search', component: '../pages/search/index', title: '搜索' },

        // 异常页面（主前用于显示商品下架）
        { path: '/exception', component: '../pages/exception/index', title: '暂未找到内容' },

        { path: '/closed', component: '../pages/closed/index', title: '店铺已打烊' },

        { path: '*', component: '../pages/404', },
      ]
    },
  ],
  exportStatic: {},
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: { immer: true },
      dynamicImport: {
        webpackChunkName: true,
        // loading: 'components/Loader/Loader',
      },
      title: true,
      dll: true,
      locale: {
        enable: true,
        default: 'zh-CN',
      },
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
      chunks: ['vendors', 'styles', 'umi'],
      headScripts: [
        'https://res.wx.qq.com/open/js/jweixin-1.6.0.js',
        { content: `
            var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?5ac61a48cd717d4b5613b84464dee99e";
              var s = document.getElementsByTagName("script")[0]; 
              s.parentNode.insertBefore(hm, s);
            })();
        `, charset: 'utf-8' },
      ],
    }],
  ],
  chainWebpack: function (config, { webpack }) {
    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 1,
          automaticNameDelimiter: '.',
          cacheGroups: {
            vendor: {
              name: 'vendors',
              test({ resource }) {
                return /[\\/]node_modules[\\/]/.test(resource);
              },
              priority: 10,
            },
            styles: {
              name: 'styles',
              test: /\.(css|less)$/,
              chunks: 'async',
              minChunks: 1,
              minSize: 0,
            }
          },
        },
      }
    });
  },
}

export default config
