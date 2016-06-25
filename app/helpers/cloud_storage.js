/**
 * 本地与云存储同步
 *
 */

import AV from 'leancloud-storage/dist/av-es6'
import _ from 'lodash'
import {SYNC_PLATFORMS} from './const'
// TODO store in env
const APP_ID = 'NvXAKPjls3var5LvgsMtYCn3-gzGzoHsz'

const APP_KEY = 'mJNhQagXGiO2Yjj59ixEVKYR'

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})

export function query(key, value) {
  let q = new AV.query('posts')
  if (!key || !value) {
    return Promise.reject(new Error('查询参数错误'))
  }

  q.equalTo(key, value)
  q.limit(256)
  return q.find()
}

export function getCurrentUser() {
  return AV.User.current()
}

export function signup({email, password}) {
  let user = new AV.User()
  user.setUsername(email)
  user.setPassword(password)
  user.setEmail(email)
  return user.signUp()
}

export function logout() {
  AV.User.logOut()
}

export function signin({email, password}) {
  return AV.User.logIn(email, password)
}

export function isEqual(cloudPost, localPost) {
  let keys = SYNC_PLATFORMS.map(key => {
    return `${key}_id`
  })
  return _.every(keys.concat('title', 'content', 'update_on'), key => {
    return localPost[key] === cloudPost[key]
  })
}

export function mergePlatformInfo(cloudPost, localPost) {
  let info = {}
  SYNC_PLATFORMS.map(key => {
    return `${key}_id`
  }).forEach(key => {
    // 如果有冲突
    if (cloudPost && cloudPost[key] && localPost[key]) {
      if (cloudPost.update_on >= localPost.update_on) {
        info[key] = cloudPost[key]
      } else {
        info[key] = localPost[key]
      }
    } else {
      let value = (cloudPost && cloudPost[key]) || localPost[key]
      if (value) {
        info[key] = value
      }
    }
  })
  return info
}

/**
 * 获取云端更新对象（post较新）
 * 可能更新也可能插入
 * NOTE 云端数据同步时始终不删除，由特定删除操作触发才删除
 */
export function getCloudUpsert(cloudPost, post) {
  let item = {
    ...mergePlatformInfo(cloudPost, post),
    title: post.title,
    create_on: cloudPost ? cloudPost.create_on : post.create_on,
    update_on: post.update_on
  }
  if (cloudPost) {
    item.id = cloudPost.id
  }
  // reducing request payload in non-test env
  if (process.env.NODE_ENV === 'test') {
    item.content = post.content
  } else {
    // content数据量可能比较大，能不更新就不更新
    if (!cloudPost || cloudPost.content !== post.content) {
      item.content = post.content
    }
  }

  return item
}

/**
 * 从云端作品更新/插入本地作品
 * NOTE
 * title/content/update_on/object_id可以直接使用云端数据覆盖
 * 平台作品id因为涉及到帐号切换问题可能两端不一致
 * 还有本地平台作品id数据可能比云端丰富是否需要更新？
 */
export function getLocalUpsert(cloudPost, localPost) {
  if (localPost) {
    return {
      id: localPost.id,
      object_id: cloudPost.id,
      title: cloudPost.title,
      content: cloudPost.content,
      create_on: cloudPost.create_on,
      update_on: cloudPost.update_on,
      ...mergePlatformInfo(cloudPost, localPost)
    }
  }

  return {
    ...cloudPost,
    object_id: cloudPost.id,
    id: null
  }
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
      cloud.push(getCloudUpsert(null, item))
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
      let post = getLocalUpsert(cloudPost, item)
      local.update.push(post)
      if (isEqual(cloudPost, post)) {
        return
      }

      // 云端也需要更新
      cloud.push(getCloudUpsert(cloudPost, post))
      return
    }

    // 本地较新，更新云端（平台不一致本地也更新）
    let upsert = getCloudUpsert(cloudPost, item)
    cloud.push(upsert)
    // 云端content默认无差别不更新（减少payload）
    let post = Object.assign({
      content: item.content
    }, upsert)
    if (!isEqual(post, item)) {
      local.update.push(getLocalUpsert(post, item))
    }
  })

  local.insert = cloudPosts.filter(post => {
    return localObjectIdList.indexOf(post.id) === -1
  }).map(post => {
    return getLocalUpsert(post)
  })

  return {cloud, local}
}

export function syncNow(cloudPosts, localPosts) {
  let task = compare(cloudPosts, localPosts)
  return task
}
