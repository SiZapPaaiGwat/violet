export const SUPPORT_PLATFORM_MAP = {
  zhihu: {
    name: 'zhihu',
    label: '知乎',
    loginUrl: 'http://www.zhihu.com/signin?next=https://zhuanlan.zhihu.com/',
    logoutUrl: 'https://www.zhihu.com/logout',
    loggedInUrl: 'https://zhuanlan.zhihu.com/',
    domain: 'zhihu.com',
    csrfTokenName: 'X-XSRF-TOKEN'
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
    name: 'jianshu',
    label: '简书',
    loginUrl: 'http://www.jianshu.com/sign_in',
    logoutUrl: 'http://www.jianshu.com/sign_out',
    loggedInUrl: 'http://www.jianshu.com/',
    domain: 'jianshu.com',
    csrfTokenName: 'X-CSRF-Token'
  }
}

export const SYNC_PLATFORMS = Object.keys(SUPPORT_PLATFORM_MAP)

export const SUPPORT_PLATFORM_LIST = SYNC_PLATFORMS.map(key => {
  return SUPPORT_PLATFORM_MAP[key]
})

export const REQUEST_TIMEOUT = 15000

/*eslint max-len: 0*/
export const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36'
