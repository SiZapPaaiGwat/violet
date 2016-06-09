import {encrypt, decrypt} from './aes'
import {SYNC_PLATFORMS} from '../helpers/const'

const SPLIT_FLAG = '\n'

// 获取帐号配置信息
export function getAccountMap() {
  let accountMap = {}
  SYNC_PLATFORMS.forEach((platform) => {
    let pair = localStorage.getItem(platform) || ''
    pair = pair && decrypt(pair).split(SPLIT_FLAG)
    accountMap[platform] = {
      username: pair && pair[0],
      password: pair && pair[1],
      repo: pair && pair[2]
    }
  })

  return accountMap
}

export function updateAccount(platform, userName, password = '', repo = '') {
  if (!userName) {
    return
  }

  localStorage.setItem(platform, encrypt(`${userName}${SPLIT_FLAG}${password}${SPLIT_FLAG}${repo}`))
}

export function removeAccountByPlatform(platform) {
  localStorage.removeItem(platform)
}

export function getCookiesByPlatform(platform = 'zhihu') {
  if (platform) {
    return localStorage.getItem(`${platform}_cookie`)
  }

  return null
}

export function setCookiesByPlatform(platform, cookie) {
  if (platform && cookie) {
    localStorage.setItem(`${platform}_cookie`, cookie)
  } else {
    localStorage.removeItem(`${platform}_cookie`)
  }
}
