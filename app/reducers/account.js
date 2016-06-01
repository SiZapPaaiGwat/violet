import State from '../helpers/initial_state'

export default function(state = State.account, {type, payload}) {
  if (type === 'update_account') {
    return {
      ...state,
      [payload.platform]: payload.value
    }
  }

  return state
}
