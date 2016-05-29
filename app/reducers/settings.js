import State from '../helpers/initial_state'

export default function(state = State.settings, action) {
  if (action.type === 'show_settings') {
    return {
      showSettings: true
    }
  }

  return state
}
