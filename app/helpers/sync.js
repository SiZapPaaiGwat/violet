import _ from 'lodash'
import * as utils from './utils'
import {syncPost} from '../../electron/ipc_render'

/**
 * 同步作品
 * 只同步登录态已经验证的平台
 */
export default function({account, post}) {
  let args = Object.assign({
    title: utils.getMarkdownTitle(post.content),
    content: utils.normalizeMarkdownContent(post.content)
  }, account)

  if (!args.title) {
    return Promise.reject(new Error('标题不能为空（格式参考：# 我的标题）'))
  }

  if (!args.content) {
    return Promise.reject(new Error('内容不能为空'))
  }

  for (let key in account) {
    args[key].key = post[`${key}_id`]
  }

  if (Object.keys(args).length === 2) {
    return Promise.reject(new Error('没有设置任何写作平台的帐号信息'))
  }

  console.log('同步作品：', args)

  return syncPost(args)
}

/**
 * 生成数据库需要更新的object
 * 主要是各个平台的id
 */
export function getDatabaseUpdates(id, json) {
  // 生成数据库需要更新的数据
  let keys = Object.keys(json)
  let updates = _.zipObject(keys.map(key => {
    return `${key}_id`
  }), keys.map(key => {
    return json[key]
  }))
  return Object.assign(updates, {id})
}

/**
 * 获取平台登录状态
 * 知乎比较特殊登录以后还要判断是否已经申请专栏
 */
export function getLoginStatus(json) {
  let keys = Object.keys(json)
  let values = keys.map(platform => {
    let result = json[platform]
    if (platform === 'zhihu') {
      return result ? {
        writable: result.columns.length > 0
      } : false
    }

    return !!result
  })

  return _.zipObject(keys, values)
}

/**
 * 获取可以同步的平台
 */
export function getSyncablePlatforms(account, status) {
  let result = {}
  for (let key in account) {
    if (status[key]) {
      result[key] = account[key]
    }
  }

  return result
}
