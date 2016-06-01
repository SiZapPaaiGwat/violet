export function update({platform, value}) {
  return {
    type: 'update_account',
    payload: {platform, value}
  }
}
