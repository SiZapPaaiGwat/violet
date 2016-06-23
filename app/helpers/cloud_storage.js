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
  return _.every(['title', 'content'], key => {
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
 * 获取需要同步到云端作品
 * 只有两种情况：
 * 1)本地还没有同步到云端，直接到云端插入
 * 2)本地已经同步到云端，当与云端内容不一致且更新时间比云端大，直接更新云端
 */
export function getCloudUpsertPosts(cloudPosts = [], localPosts = []) {
  // 还没有上传的作品
  let upsertPosts = []
  let updateOn = Date.now()
  let push = (post) => {
    let item = {
      ...post,
      update_on: updateOn
    }
    delete item.id
    delete item.object_id
    upsertPosts.push(item)
    return item
  }

  localPosts.forEach(item => {
    // 本地作品还没同步过
    if (!item.object_id) {
      push(item)
      return
    }

    let cloudPost = _.find(cloudPosts, {id: item.object_id})

    // 云端作品已经被删除，此时需要删除本地作品
    if (!cloudPost) {
      return
    }

    // 内容一致
    if (isEqual(cloudPost, item)) {
      return
    }

    // 服务端新，需要更新本地作品
    if (cloudPost.update_on >= item.update_on) {
      return
    }

    // 本地较新，更新云端
    let post = push(item)
    post.id = item.object_id
  })

  return upsertPosts
}

/**
 * 获取本地需要更新的数据
 * 本地数据更新有三种情况：
 * 1) 作品已经同步，需要更新本地信息
 * 2) 作品已经同步，云端已经删除，需要删除本地
 * 3) 需要在本地插入数据
 */
export function getLocalUpsertPosts() {

}
