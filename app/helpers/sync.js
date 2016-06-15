import _ from 'lodash'
import * as utils from './utils'
import {SUPPORT_PLATFORM_MAP} from './const'
import {SyncFactory} from '../../electron/ipc_render'

/**
 * 根据帐号信息同步作品
 * 有帐号信息就默认已登录，实际帐号信息是否过期由接口自行返回
 * 早先这里是支持同步多个平台，但是无法详细控制每个平台的进度所以改造为一次同步一个
 */
function syncPostByAccount({account, post}) {
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
 * 同步作品(新增或更新)以后主进程会返回当前作品在各个平台的id
 * 此接口用于生成更新到数据库部分的数据，对应各个平台的id
 * 不过目前实际调用也是单个单个调
 */
export function getDatabaseUpdates(id, serverUpsertJson) {
  let keys = Object.keys(serverUpsertJson)
  let updates = _.zipObject(keys.map(key => {
    return `${key}_id`
  }), keys.map(key => {
    return serverUpsertJson[key]
  }))
  return Object.assign(updates, {id})
}

/**
 * 获取可以同步的平台
 * 本地帐号信息非空就可以同步，是否成功以实际调用为准
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

/**
 * 根据平台帐号信息获取初始平台同步进度数据
 */
export function getNotifierInitialTasks(account) {
  return Object.keys(account).map(key => {
    return {
      name: key,
      label: SUPPORT_PLATFORM_MAP[key].label,
      status: 'waiting'
    }
  })
}

/**
 * 各平台独自同步作品
 */
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
