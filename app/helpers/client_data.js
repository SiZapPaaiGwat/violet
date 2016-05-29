import {encrypt, decrypt} from './aes'
import {SYNC_PLATFORMS} from '../helpers/const'
import {detectLoginStatus} from '../../electron/ipc_render'

const SPLIT_FLAG = '\n'

export function getAccountMap() {
  let accountMap = {}
  // 获取帐号配置信息
  SYNC_PLATFORMS.forEach((platform) => {
    let pair = localStorage.getItem(platform) || ''
    pair = pair && decrypt(pair).split(SPLIT_FLAG)
    accountMap[platform] = {
      username: pair && pair[0],
      password: pair && pair[1]
    }
  })

  return accountMap
}

export function updateAccount(platform, userName, password) {
  if (!userName || !password) {
    return
  }

  localStorage.setItem(platform, encrypt(`${userName}${SPLIT_FLAG}${password}`))
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

export function getLoginDetails(accountMap) {
  return detectLoginStatus({
    zhihu: {
      cookie: getCookiesByPlatform('zhihu')
    },
    github: {
      username: accountMap.github.username,
      password: accountMap.github.password
    }
  })
}
