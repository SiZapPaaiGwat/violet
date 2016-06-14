import State from '../helpers/initial_state'

export default function(state = State.notifier, {type, payload}) {
  if (type === 'set_tasks') {
    return Array.isArray(payload) ? payload : state
  }

  if (type === 'update_task') {
    let {name} = payload || {}
    let newState = [...state]
    let target = newState.filter(item => {
      return item.name === name
    })

    if (target.length === 0) {
      console.warn('指定对象不存在', payload)
      return state
    }

    target = target[0]
    Object.assign(target, payload)
    return newState
  }

  return state
}
