import _ from 'lodash'
import * as utils from './utils'
import {SUPPORT_PLATFORM_MAP, SYNC_PLATFORMS} from './const'
import {SyncFactory} from '../../electron/ipc_render'

/**
 * 根据帐号信息同步作品
 * 有帐号信息就默认已登录，实际帐号信息是否过期由接口自行返回
 * 早先这里是支持同步多个平台，但是无法详细控制每个平台的进度所以改造为一次同步一个
 */
function syncPostByAccount({account, post}) {
  let keys = Object.keys(account)
  if (keys.length > 1) {
    throw new Error('一次只能发布一个平台的数据')
  }

  let title = utils.getMarkdownTitle(post.content)
  let content = utils.normalizeMarkdownContent(post.content)

  if (!title) {
    return Promise.reject(new Error('标题不能为空（格式参考：# 我的标题）'))
  }

  if (!content) {
    return Promise.reject(new Error('内容不能为空'))
  }

  let args = {}
  for (let field in account) {
    args[field] = {
      title, content,
      key: post[`${field}_id`]
    }
  }

  let platform = keys[0]
  return SyncFactory[platform](_.merge({}, account, args))
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
export function getSyncablePlatforms(account) {
  let result = {}
  for (let key in account) {
    if (account[key]) {
      result[key] = account[key]
    }
  }

  return result
}

export function getSyncedPlatforms(post) {
  return SYNC_PLATFORMS.filter(item => {
    return !!post[`${item}_id`]
  })
}

export function getSyncedTooltip(post) {
  let syncList = getSyncedPlatforms(post)
  if (syncList.length === 0) {
    return '作品尚未发布'
  }

  let labels = syncList.map(item => {
    return SUPPORT_PLATFORM_MAP[item].label
  })

  return `${labels.join(',')}已发布`
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
