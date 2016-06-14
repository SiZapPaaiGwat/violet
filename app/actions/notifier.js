export function set(payload) {
  return {
    type: 'set_tasks',
    payload
  }
}

export function update(payload) {
  return {
    type: 'update_task',
    payload
  }
}
