import {encrypt, decrypt} from './aes'
import {SYNC_PLATFORMS, UID} from '../helpers/const'

// 获取帐号配置信息
export function getAccountMap() {
  let accountMap = {}
  SYNC_PLATFORMS.forEach((platform) => {
    try {
      let str = localStorage.getItem(platform)
      let account = str ? JSON.parse(decrypt(str)) : null
      // 没有数据就不要设置empty object
      if (account) {
        accountMap[platform] = account
      }
    } catch (err) {
      localStorage.removeItem(platform)
    }
  })

  return accountMap
}

export function updateAccount(platform, account) {
  if (!account) {
    return
  }

  localStorage.setItem(platform, encrypt(JSON.stringify(account)))
}

export function removeAccountByPlatform(platform) {
  localStorage.removeItem(platform)
}
