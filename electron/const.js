export let SUPPORT_PLATFORM_MAP = {
  zhihu: {
    name: 'zhihu',
    label: '知乎'
  },
  medium: {
    name: 'medium',
    label: 'Medium'
  },
  github: {
    name: 'github',
    label: 'GitHub'
  }
}

export const SYNC_PLATFORMS = Object.keys(SUPPORT_PLATFORM_MAP)

export const SUPPORT_PLATFORM_LIST = SYNC_PLATFORMS.map(key => {
  return SUPPORT_PLATFORM_MAP[key]
})

export const REQUEST_TIMEOUT = 15000

export const ZHIHU_XSRF_TOKEN_NAME = 'XSRF-TOKEN'
