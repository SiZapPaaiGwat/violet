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

function logError({message, status, text, response, stack}) {
  let {req} = response || {}
  console.log(stack)
  console.log(`
    Error message: ${message}
    Path: ${req ? req.path : '-'}
    Status: ${status}
    Response Text: ${text}
  `)
}

function registerEvent(eventName, methodName, allowParallel = false) {
  ipcMain.on(`${eventName}-start`, (event, platforms) => {
    let keys = Object.keys(platforms)
    if (!allowParallel) {
      if (keys.length > 1) {
        console.error(platforms)
        throw new Error(`Parallel is not allowed for event ${eventName}`)
      }
    }

    let handlerList = PlatformHandler.map(keys).map((instance, i) => {
      return new instance(platforms[keys[i]])[methodName]()
    })

    Promise.all(handlerList).then(result => {
      event.sender.send(`${eventName}-finish`, zipObject(keys, result))
    }).catch(error => {
      logError(error)
      let {message, status, text} = error
      event.sender.send(`${eventName}-error`, {message, status, text})
    })
  })
}

/**
 * NOTE
 * 这里需要针对每个平台绑定一次事件
 * electron ipcMain的事件机制决定
 * 如果共用一个事件，一个请求失败其它都失败
 */
SYNC_PLATFORMS.forEach(platform => {
  registerEvent(`sync-post-${platform}`, 'publish', false)
})

registerEvent('check-identity', 'whoAmI', false)
