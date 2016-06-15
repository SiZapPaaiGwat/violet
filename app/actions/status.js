export function update({platform, value}) {
  return {
    type: 'update_toolbar_status',
    payload: {platform, value}
  }
}
