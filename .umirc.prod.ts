/**
 * 部署配置
 */
import { IConfig } from 'umi-types'

const hostname = 'https://open.beautifulreading.com'
const pathname = '/m/'

// ref: https://umijs.org/config/
const config: IConfig = {
  publicPath: `${hostname}${pathname}`,
  base: pathname,
  define: {
    GLOBAL_CONFIG: {
      BASE_PATH: 'm',
      API_URL: 'https://minalogin.beautifulreading.com',
      COMPONENT_APPID: 'wx74d4ade1edb19eb5',
      QINIU_CDN: 'https://qcdn.beautifulreading.com',
    }
  },
  copy: [
    {
      from:'src/static_html/wxjump.html',
      to:'wxjump.html'
    }
  ],
}

export default config
