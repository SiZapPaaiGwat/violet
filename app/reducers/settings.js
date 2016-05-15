export default function(state = {showSettings: false}, action) {
  if (action.type === 'show_settings') {
    return {
      showSettings: true
    }
  }

  return state
}
