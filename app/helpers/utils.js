const HEADING_REG = /^ *# +[^\n]*\n/g

export function getCookieByName(cookie, name) {
  let match = cookie.match(new RegExp(`${name}=([^;]+)`, 'i'))
  return match ? match[1] : null
}

export function updateCookie(cookie, pair) {
  let pairs = cookie.split(';')
  let key = pair.split('=')[0].trim()
  for (let i = 0; i < pairs.length; i += 1) {
    if (pairs[i].split('=')[0].trim() === key) {
      pairs.splice(i, 1)
      return pairs.join(';') + pair
    }
  }

  return cookie
}

export function cookieTokenUtil(oldCookie, newToken) {
  return {
    cookie: updateCookie(oldCookie, `XSRF-TOKEN=${newToken}`),
    token: newToken
  }
}

export function getMarkdownTitle(text = '') {
  let matched = text.trim().match(HEADING_REG)
  if (matched) {
    return matched[0].replace(/^ *# +/g, '')
  }

  return null
}

export function normalizeMarkdownContent(text) {
  return text.trim().replace(HEADING_REG, '').trim()
}
