import {ipcRenderer} from 'electron'

// TODO 封装消息发送和接受（start/finish）

ipcRenderer.on('user-action-error', (e, {error, title = '未知错误'}) => {
  console.log('#Main process error')
  console.log(`#title=${title}`)
  console.log(error)
  App.alert(title, error.message)
})

export function syncPost(args) {
  if (typeof args !== 'object') {
    return Promise.reject(new Error('参数必须传对象'))
  }

  return new Promise(function(resolve, reject) {
    ipcRenderer.on('sync-post-finish', function(e, arg) {
      resolve(arg)
    })
    ipcRenderer.send('sync-post-start', args)
  })
}

/**
 * 获取站点cookie
 * 主站和子站的cookie需要同时获取
 *
 * NOTE electron session.cookies.get({}) filter不起作用
 */
export function parseWebviewCookiesByDomain(session, domain) {
  return new Promise(function(resolve, reject) {
    session.cookies.get({}, function(error, cookies) {
      if (error) {
        reject(error)
        return
      }

      let cookie = cookies.filter(item => {
        return item.domain.indexOf(domain) > -1
      }).map(function(item) {
        return `${item.name}=${item.value};`
      })

      resolve(cookie.join(' '))
    })
  })
}

export function detectLoginStatus(args) {
  return new Promise((resolve, reject) => {
    ipcRenderer.on('detect-login-status-finish', function(e, arg) {
      resolve(arg)
    })
    ipcRenderer.send('detect-login-status-start', args)
  })
}

export function whoAmI(args) {
  return new Promise((resolve, reject) => {
    ipcRenderer.on('zhihu-whoami-finish', function(e, arg) {
      resolve(arg)
    })
    ipcRenderer.send('zhihu-whoami-start', args)
  })
}
