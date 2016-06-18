export const SUPPORT_PLATFORM_MAP = {
  zhihu: {
    // 此url专门用于删除cookie或者主页地址
    url: 'https://www.zhihu.com',
    name: 'zhihu',
    label: '知乎',
    loginUrl: 'http://www.zhihu.com/signin?next=https://zhuanlan.zhihu.com/',
    logoutUrl: 'https://www.zhihu.com/logout',
    loggedInUrl: 'https://zhuanlan.zhihu.com/',
    domain: 'zhihu.com',
    csrfTokenName: 'X-XSRF-TOKEN',
    // 删除此cookie即注销
    cookieName: 'z_c0'
  },
  medium: {
    name: 'medium',
    label: 'Medium',
  },
  github: {
    name: 'github',
    label: 'GitHub'
  },
  jianshu: {
    url: 'http://www.jianshu.com',
    name: 'jianshu',
    label: '简书',
    loginUrl: 'http://www.jianshu.com/sign_in',
    logoutUrl: 'http://www.jianshu.com/',
    loggedInUrl: 'http://www.jianshu.com/',
    domain: 'jianshu.com',
    csrfTokenName: 'X-CSRF-Token',
    cookieName: '_session_id,remember_user_token'
  }
}

export const SYNC_PLATFORMS = Object.keys(SUPPORT_PLATFORM_MAP)

export const SUPPORT_PLATFORM_LIST = SYNC_PLATFORMS.map(key => {
  return SUPPORT_PLATFORM_MAP[key]
})

export const REQUEST_TIMEOUT = 15000

/*eslint max-len: 0*/
export const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36'

export const HUMAN_HEADERS = {
  Accept: '*/*',
  Connection: 'keep-alive',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'zh-CN,zh;q=0.8',
  'User-Agent': UA,
}
