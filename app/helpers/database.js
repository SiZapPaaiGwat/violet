import Database from 'dexie'

export let db = new Database('violet')

db.version(1).stores({
  posts: '++id, title, content, create_on, zhihu_id, github_id'
})

export function createPost(title, content) {
  return db.posts.add({
    title,
    content,
    create_on: Date.now()
  })
}

export function listPosts() {
  return db.open().then(() => {
    return db.posts.toArray()
  })
}

export function updatePost(id, params) {
  return db.posts.update(id, params)
}

export function deletePost(key) {
  return db.posts.delete(key)
}
