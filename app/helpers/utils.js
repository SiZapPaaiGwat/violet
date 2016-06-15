const HEADING_REG = /^ *# +[^\n]*\n*/g

export function getCookieByName(cookie, name) {
  let match = cookie && cookie.match(new RegExp(`${name}=([^;]+)`, 'i'))
  return match ? match[1] : null
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
