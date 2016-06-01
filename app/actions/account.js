export function update(payload) {
  if (!payload.platform || !payload.value) {
    throw new Error('platform and value are required fields.')
  }

  return {
    type: 'update_account',
    payload
  }
}
