import {ipcRenderer} from 'electron'

function registerEvent(name, details) {
  return function(args) {
    if (typeof args !== 'object') {
      return Promise.reject(new Error('参数必须传对象'))
    }

    console.log(`${details} :`, args)

    return new Promise(function(resolve, reject) {
      ipcRenderer.on(`${name}-finish`, function(e, arg) {
        resolve(arg)
      })
      ipcRenderer.send(`${name}-start`, args)
    })
  }
}

ipcRenderer.on('user-action-error', (e, {text, title = '未知错误', error}) => {
  console.log('#Main process error')
  console.error(error)
  App.alert(title, error.status === 404 ? '可能作品已经删除' : text)
  App.stopLoading()
})

export let syncPost = registerEvent('sync-post', 'Syncing post')

export let detectLoginStatus = registerEvent('detect-login-status', 'Detecting login status')

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
