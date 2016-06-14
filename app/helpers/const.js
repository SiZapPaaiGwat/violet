import zhihuIcon from '../imgs/zhihu.ico'
import githubIcon from '../imgs/github.ico'
import mediumIcon from '../imgs/medium.ico'
import * as CONST from '../../electron/const'

export let SUPPORT_PLATFORM_MAP = {
  zhihu: {
    ...CONST.SUPPORT_PLATFORM_MAP.zhihu,
    icon: zhihuIcon
  },
  medium: {
    ...CONST.SUPPORT_PLATFORM_MAP.medium,
    icon: mediumIcon
  },
  github: {
    ...CONST.SUPPORT_PLATFORM_MAP.github,
    icon: githubIcon
  }
}

export const SYNC_PLATFORMS = CONST.SYNC_PLATFORMS

export const SUPPORT_PLATFORM_LIST = SYNC_PLATFORMS.map(key => {
  return SUPPORT_PLATFORM_MAP[key]
})

export const DEFAULT_TITLE = '无标题文档'

export const DEFAULT_CONTENT = '# 无标题文档 \n\n开动起来吧...'

export const ZHIHU_XSRF_TOKEN_NAME = CONST.ZHIHU_XSRF_TOKEN_NAME

export const ZHUANLAN_URL = 'https://zhuanlan.zhihu.com/'

export const LOGIN_URL = `http://www.zhihu.com/signin?next=${ZHUANLAN_URL}`

export const LOGOUT_URL = 'https://www.zhihu.com/logout'

export const ZHIHU_DOMAIN = 'zhihu.com'

export const AUTO_SAVING_STORE_PERIOD = 250

export const AUTO_SAVING_DATABASE_PERIOD = 3000

export const REQUEST_TIMEOUT = CONST.REQUEST_TIMEOUT
