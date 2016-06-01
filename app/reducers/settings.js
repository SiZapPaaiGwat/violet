import State from '../helpers/initial_state'

export default function(state = State.settings, {type, payload}) {
  if (type === 'show_settings') {
    return {
      ...state,
      name: payload.name
    }
  }

  return state
}
