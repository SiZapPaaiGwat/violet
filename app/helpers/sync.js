import _ from 'lodash'
import * as utils from './utils'
import {SUPPORT_PLATFORM_MAP} from './const'
import {SyncFactory} from '../../electron/ipc_render'

/**
 * 同步作品
 * 只同步登录态已经验证的平台
 */
export function syncPostByAccount({account, post}) {
  if (Object.keys(account).length !== 1) {
    console.error(account)
    throw new Error('一次只能同步一个平台的数据')
  }

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

  let platform = Object.keys(account)[0]

  return SyncFactory[platform](args)
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
export function getSyncablePlatforms(account, status, post) {
  let result = {}
  for (let key in account) {
    if (status[key]) {
      result[key] = account[key]
    }
  }

  return result
}

/**
 * 检查是否有同步任务正在进行
 */
export function isNotifierRunning(tasks) {
  return tasks.some(task => {
    return task.status === 'waiting'
  })
}

export function getNotifierInitialTasks(account) {
  return Object.keys(account).map(key => {
    return {
      name: key,
      label: SUPPORT_PLATFORM_MAP[key].label,
      status: 'waiting'
    }
  })
}

export function syncPostWithNotifier({account, post, onSuccess, onError}) {
  for (let platform in account) {
    syncPostByAccount({
      post,
      account: {
        [platform]: account[platform]
      }
    })
    .then(function(result) {
      onSuccess(result, platform)
    })
    .catch(function(err) {
      onError(err, platform)
    })
  }
}
