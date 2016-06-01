export function update({platform, value}) {
  return {
    type: 'update_login_status',
    payload: {platform, value}
  }
}
