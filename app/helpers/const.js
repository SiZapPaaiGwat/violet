import _ from 'lodash'
import zhihuIcon from '../imgs/zhihu.ico'
import githubIcon from '../imgs/github.ico'
import mediumIcon from '../imgs/medium.ico'
import jianshuIcon from '../imgs/jianshu.ico'
import * as CONST from '../../electron/const'

export const SUPPORT_PLATFORM_MAP = _.merge({
  zhihu: {
    icon: zhihuIcon
  },
  medium: {
    icon: mediumIcon
  },
  github: {
    icon: githubIcon
  },
  jianshu: {
    icon: jianshuIcon
  }
}, CONST.SUPPORT_PLATFORM_MAP)

console.log(SUPPORT_PLATFORM_MAP)

export const SYNC_PLATFORMS = Object.keys(SUPPORT_PLATFORM_MAP)

export const SUPPORT_PLATFORM_LIST = SYNC_PLATFORMS.map(key => {
  return SUPPORT_PLATFORM_MAP[key]
})

export const DEFAULT_TITLE = '无标题文档'

export const DEFAULT_CONTENT = '# 无标题文档 \n\n开动起来吧...'

export const AUTO_SAVING_STORE_PERIOD = 250

export const AUTO_SAVING_DATABASE_PERIOD = 3000

export const REQUEST_TIMEOUT = CONST.REQUEST_TIMEOUT
