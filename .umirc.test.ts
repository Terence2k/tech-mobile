/**
 * 部署配置
 */
import { IConfig } from 'umi-types'

const hostname = 'https://open.beautifulreading.com'
const pathname = '/dev-m/'

// ref: https://umijs.org/config/
const config: IConfig = {
  publicPath: `${hostname}${pathname}`,
  base: pathname,
  define: {
    GLOBAL_CONFIG: {
      BASE_PATH: 'dev-m',
      API_URL: 'https://dev-minalogin.beautifulreading.com',
      COMPONENT_APPID: 'wxbbef7477a0d5524a',
      QINIU_CDN: 'https://qcdn.beautifulreading.com',
    }
  },
  copy: [
    {
      from:'src/static_html/dev_wxjump.html',
      to:'wxjump.html'
    }
  ],
}

export default config
