/**
 * 本地与云存储同步
 *
 */

import AV from 'leancloud-storage'
import _ from 'lodash'
import {SYNC_PLATFORMS} from './const'

const APP_ID = 'NvXAKPjls3var5LvgsMtYCn3-gzGzoHsz'

const APP_KEY = 'mJNhQagXGiO2Yjj59ixEVKYR'

export function init() {
  AV.init({
    appId: APP_ID,
    appKey: APP_KEY
  })
}

export function query(platform, username) {
  let q = new AV.query('posts')
  if (!platform || !username) {
    return Promise.reject(new Error('查询参数错误'))
  }

  if (SYNC_PLATFORMS.indexOf(platform) === -1) {
    return Promise.reject(new Error('查询平台参数错误'))
  }

  q.equalTo(platform, username)
  return q.find()
}

export function isEqual(cloudPost, localPost) {
  return _.every(SYNC_PLATFORMS.concat('title', 'content', 'update_on'), key => {
    return localPost[key] === cloudPost[key]
  })
}

export function mergePlatformInfo(cloudPost, localPost) {
  let info = {}
  SYNC_PLATFORMS.forEach(key => {
    info[key] = cloudPost[key] || localPost[key]
  })
  return info
}

/**
 * 获取云端更新对象
 * 可能更新也可能插入
 * NOTE 云端数据同步时始终不删除，由特定删除操作触发才删除
 */
export function getCloudUpsert(post, cloudPost) {
  let item = {
    ...mergePlatformInfo(post, cloudPost),
    title: post.title,
    content: post.content,
    create_on: cloudPost.create_on,
    update_on: cloudPost ? post.update_on : Date.now()
  }
  if (cloudPost) {
    item.id = cloudPost.id
  }
  return item
}

/**
 * 从云端作品插入到本地
 */
export function getLocalInsert(cloudPost) {
  return {
    ...cloudPost,
    id: null
  }
}

/**
 * 从云端作品更新本地作品
 */
export function getLocalUpdateParams(cloudPost, localPost) {
  let params = {
    id: localPost.id
  }
  for (let key in localPost) {
    if (key === 'id' || key === 'object_id') {
      continue
    }

    if (cloudPost[key] !== localPost[key]) {
      params[key] = cloudPost[key]
    }
  }
  return params
}

/**
 * 云端更新
 * 两种情况：
 * 1)本地未同步的直接插入
 * 2)本地已同步的更新时间大于云端时间
 *
 * 本地更新
 * 三种情况：
 * 1) 本地已同步的更新时间小于云端时间
 * 2) 本地已同步，但云端已经删除
 * 3) 本地还没有此记录
 *
 * @return {Object} {cloud: [], local: {remove, insert, update}}
 */
export function compare(cloudPosts = [], localPosts = []) {
  // 还没有上传的作品
  let cloud = []
  let local = {
    remove: [],
    insert: [],
    update: []
  }

  let localObjectIdList = []
  localPosts.forEach(item => {
    // 未同步，云端插入
    if (!item.object_id) {
      cloud.push(getCloudUpsert(item))
      return
    }

    localObjectIdList.push(item.object_id)

    let cloudPost = _.find(cloudPosts, {id: item.object_id})

    // 云端作品已经被删除，此时需要删除本地作品
    if (!cloudPost) {
      local.remove.push(item.id)
      return
    }

    // 内容一致
    if (isEqual(cloudPost, item)) {
      return
    }

    // 服务端新，需要更新本地作品
    if (cloudPost.update_on >= item.update_on) {
      local.update.push(getLocalUpdateParams(cloudPost, item))
      return
    }

    // 本地较新，更新云端
    cloud.push(getCloudUpsert(item, cloudPost))
  })

  local.insert = cloudPosts.filter(post => {
    return localObjectIdList.indexOf(post.id) === -1
  }).map(post => {
    return getLocalInsert(post)
  })

  return {cloud, local}
}
