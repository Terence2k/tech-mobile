/**
 * 开发配置
 */
import { IConfig } from 'umi-types'

// ref: https://umijs.org/config/
const config: IConfig = {
  publicPath: '/',
  base: '/dev-m/',
  proxy: {
    "/api": {
      "target": "https://dev-minalogin.beautifulreading.com/",
      "changeOrigin": true,
      "pathRewrite": { "^/api": "" }
    }
  },
  define: {
    GLOBAL_CONFIG: {
      BASE_PATH: 'dev-m',
      API_URL: 'https://dev-minalogin.beautifulreading.com',
      COMPONENT_APPID: 'wxbbef7477a0d5524a',
      QINIU_CDN: 'https://qcdn.beautifulreading.com'
    }
  },
}

export default config
