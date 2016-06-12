export let SYNC_PLATFORMS = ['zhihu', 'github', 'medium', 'jianshu']

// TODO 这里需要换成数组优化
export let PLATFORM_INFO = {
  zhihu: {
    name: '知乎',
    site: 'https://www.zhihu.com/',
    icon: 'https://static.zhihu.com/static/favicon.ico'
  },
  github: {
    name: 'GitHub',
    site: 'https://github.com/',
    icon: 'https://assets-cdn.github.com/favicon.ico'
  },
  medium: {
    name: 'Medium',
    site: 'https://www.zhihu.com/',
    icon: 'https://static.zhihu.com/static/favicon.ico'
  },
  jianshu: {
    name: '简书',
    site: 'https://github.com/',
    icon: 'https://assets-cdn.github.com/favicon.ico'
  }
}

export const DEFAULT_TITLE = '无标题文档'

export const DEFAULT_CONTENT = '# 无标题文档 \n\n开动起来吧...'

export const ZHIHU_XSRF_TOKEN_NAME = 'XSRF-TOKEN'

export const ZHUANLAN_URL = 'https://zhuanlan.zhihu.com/'

export const LOGIN_URL = `http://www.zhihu.com/signin?next=${ZHUANLAN_URL}`

export const LOGOUT_URL = 'https://www.zhihu.com/logout'

export const ZHIHU_DOMAIN = 'zhihu.com'

export const AUTO_SAVING_STORE_PERIOD = 250

export const AUTO_SAVING_DATABASE_PERIOD = 3000

export const REQUEST_TIMEOUT = 15000
