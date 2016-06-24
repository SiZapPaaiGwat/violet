import Database from 'dexie'
import {SYNC_PLATFORMS} from './const'

export let db = new Database('violet')

db.version(1).stores({
  posts: `++id, object_id, title, content, create_on, update_on, ${SYNC_PLATFORMS.join(', ')}`
})

export function createPost(title, content, params = {}, now = Date.now()) {
  return db.posts.add({
    title,
    content,
    ...params,
    create_on: now,
    update_on: now
  })
}

export function listPosts() {
  return db.open().then(() => {
    return db.posts.toArray()
  })
}

// 调用者自己判断更新时间是否大于创建时间
export function updatePost(id, params) {
  let {updateOn} = params
  if (!updateOn) {
    updateOn = Date.now()
  }
  return db.posts.update(id, {
    ...params,
    update_on: updateOn
  })
}

export function deletePost(key) {
  return db.posts.delete(key)
}
