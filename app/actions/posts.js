export function create(payload) {
  return {
    type: 'create_post',
    payload
  }
}

export function list({posts}) {
  return {
    type: 'list_post',
    payload: posts
  }
}

export function select(post) {
  return {
    type: 'select_post',
    payload: post
  }
}

export function update(payload) {
  return {
    type: 'update_post',
    payload
  }
}

export function loading({id, isLoading}) {
  return {
    type: 'set_post_loading_status',
    payload: {id, isLoading}
  }
}
