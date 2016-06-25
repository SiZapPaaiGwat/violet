import _ from 'lodash'
import * as CONST from '../../electron/const'

export const SUPPORT_PLATFORM_MAP = _.merge({
  zhihu: {
    icon: process.env.NODE_ENV !== 'test' && require('../imgs/zhihu.ico')
  },
  medium: {
    icon: process.env.NODE_ENV !== 'test' && require('../imgs/medium.ico')
  },
  github: {
    icon: process.env.NODE_ENV !== 'test' && require('../imgs/github.ico')
  },
  jianshu: {
    icon: process.env.NODE_ENV !== 'test' && require('../imgs/jianshu.ico')
  }
}, CONST.SUPPORT_PLATFORM_MAP)

export const SYNC_PLATFORMS = Object.keys(SUPPORT_PLATFORM_MAP)

export const SUPPORT_PLATFORM_LIST = SYNC_PLATFORMS.map(key => {
  return SUPPORT_PLATFORM_MAP[key]
})

export const DEFAULT_TITLE = '无标题文档'

export const DEFAULT_CONTENT = '# 无标题文档 \n\n开动起来吧...'

export const AUTO_SAVING_STORE_PERIOD = 250

export const AUTO_SAVING_DATABASE_PERIOD = 3000

export const REQUEST_TIMEOUT = CONST.REQUEST_TIMEOUT

// id放在第一个
export const DATABASE_FIELD_LIST = [
  'id', 'object_id', 'title', 'content', 'create_on', 'update_on'
].concat(SYNC_PLATFORMS)
