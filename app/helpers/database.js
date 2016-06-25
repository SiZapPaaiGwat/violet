import Database from 'dexie'
import {DATABASE_FIELD_LIST} from './const'

export let db = new Database('violet')

db.version(1).stores({
  posts: `++${DATABASE_FIELD_LIST.join(', ')}`
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
export function updatePost(id, params, isSilentUpdate = false) {
  let {updateOn} = params
  if (!updateOn) {
    updateOn = Date.now()
  }
  return db.posts.update(id, isSilentUpdate ? params : {
    ...params,
    update_on: updateOn
  })
}

export function deletePost(key) {
  return db.posts.delete(key)
}

export function bulk(inserts = [], updates = [], deletes = []) {
  let task = []
  if (inserts.length) {
    task.push(db.posts.bulkAdd(inserts))
  }
  if (updates.length) {
    task.push(db.posts.bulkPut(updates))
  }
  if (deletes.length) {
    task.push(db.posts.bulkDelete(deletes))
  }
  return Promise.all(task)
}
