import Database from 'dexie'

export let db = new Database('violet')

db.version(1).stores({
  posts: '++id, title, content, create_on, platforms'
})

/**
 * schema
 * id
 * title
 * content
 * create_on
 * platforms: []
 */
export function createPost(title, content) {
  return db.posts.add({
    title,
    content,
    create_on: Date.now(),
    platforms: []
  })
}

export function listPosts() {
  return db.open().then(() => db.posts.toArray())
}

export function updatePost(id, params) {
  return db.posts.update(id, params)
}

export function deletePost(key) {
  return db.posts.delete(key)
}
