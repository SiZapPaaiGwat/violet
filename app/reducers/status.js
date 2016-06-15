import State from '../helpers/initial_state'

export default function(state = State.status, {type, payload}) {
  if (type === 'update_toolbar_status') {
    return {
      ...state,
      [payload.platform]: payload.value
    }
  }

  return state
}
