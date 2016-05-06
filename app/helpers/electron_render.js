import {ipcRenderer} from 'electron'

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
 * NOTE electron按filter过滤不起作用
 */
export function parseWebviewCookiesByDomain(session, domain) {
  return new Promise(function(resolve, reject) {
    session.cookies.get({}, function(error, cookies) {
      if (error) {
        reject(error)
        return
      }

      let cookie = cookies.filter((i) => i.domain.indexOf(domain) > -1).map(function(item) {
        return `${item.name}=${item.value};`
      })

      resolve(cookie.join(' '))
    })
  })
}
