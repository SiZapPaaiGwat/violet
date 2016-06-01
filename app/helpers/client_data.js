import {encrypt, decrypt} from './aes'
import {SYNC_PLATFORMS} from '../helpers/const'
import {detectLoginStatus} from '../../electron/ipc_render'

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

export function getLoginDetails(accountMap) {
  let req = {}
  // zhihu只需要cookie即可
  if (accountMap.zhihu) {
    let cookie = getCookiesByPlatform('zhihu')
    req.zhihu = {
      cookie
    }
  }

  if (accountMap.github) {
    if (accountMap.github.username && accountMap.github.password) {
      req.github = accountMap.github
    }
  }

  if (Object.keys(req).length === 0) {
    return Promise.resolve(false)
  }

  return detectLoginStatus(req)
}
