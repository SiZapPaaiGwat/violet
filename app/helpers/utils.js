export function getCookieByName(cookie, name) {
  let match = cookie.match(new RegExp(`${name}=([^;]+)`, 'i'))
  return match ? match[1] : null
}
