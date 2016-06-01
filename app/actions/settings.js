export function show({name}) {
  return {
    type: 'show_settings',
    payload: {name}
  }
}
