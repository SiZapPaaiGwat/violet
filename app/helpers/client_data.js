import {encrypt, decrypt} from './aes'
import {SYNC_PLATFORMS} from '../helpers/const'

const SPLIT_FLAG = '\n'

export function getAccountMap() {
  let accountMap = {}
  // 获取帐号配置信息
  SYNC_PLATFORMS.forEach((platform) => {
    let pair = localStorage.getItem(platform) || ''
    pair = pair && decrypt(pair).split(SPLIT_FLAG)
    accountMap[platform] = {
      userName: pair && pair[0],
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
