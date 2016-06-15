import {ipcMain} from 'electron'
import {SYNC_PLATFORMS} from './const'
import PlatformHandler from './platforms/handler'
import './platforms/zhihu'
import './platforms/github'
import './platforms/medium'
import './platforms/jianshu'

function zipObject(keys = [], values = []) {
  let obj = {}
  keys.forEach((key, i) => {
    obj[key] = values[i]
  })
  return obj
}

function logError({message, status, text, response}) {
  let {req} = response || {}
  console.log(`
    Error message: ${message}
    Path: ${req ? req.path : '-'}
    Status: ${status}
    Response Text: ${text}
  `)
}

function registerSyncPostEvent(platform) {
  let prefix = `sync-post-${platform}`
  ipcMain.on(`${prefix}-start`, (event, {title = '', content = '', ...platforms}) => {
    let keys = Object.keys(platforms)
    if (keys.length > 1) {
      console.error(platforms)
      throw new Error('platforms应该只包含一个平台的作品信息')
    }

    let handlerList = PlatformHandler.map(keys).map((instance, i) => {
      return new instance({
        ...platforms[keys[i]],
        title: title.trim(),
        content: content.trim()
      }).publish()
    })

    Promise.all(handlerList).then(result => {
      event.sender.send(`${prefix}-finish`, zipObject(keys, result))
    }).catch(error => {
      logError(error)
      let {message, status, text} = error
      event.sender.send(`${prefix}-error`, {message, status, text})
    })
  })
}

/**
 * NOTE
 * 这里需要针对每个平台绑定一次事件
 * electron ipcMain的事件机制决定
 * 如果共用一个事件，一个请求失败其它都失败
 */
SYNC_PLATFORMS.forEach(registerSyncPostEvent)

/**
 * 保存帐号时检测当前用户信息
 * 实际使用也是单个调用
 */
ipcMain.on('check-identity-start', (event, platforms) => {
  let keys = Object.keys(platforms)
  let handlerList = PlatformHandler.map(keys).map((instance, i) => {
    return new instance(platforms[keys[i]]).whoAmI()
  })

  Promise.all(handlerList).then(result => {
    event.sender.send('check-identity-finish', zipObject(keys, result))
  }).catch(error => {
    logError(error)
    let {message, status, text} = error
    event.sender.send('check-identity-error', {message, status, text})
  })
})
