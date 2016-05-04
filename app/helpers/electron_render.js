import {ipcRenderer} from 'electron'

/**
 * 同步文章
 */
export function syncArticle(args) {
  return new Promise(function(resolve, reject) {
    ipcRenderer.on('sync-finish', function(e, arg) {
      resolve(arg)
    })
    ipcRenderer.send('sync-start', args)
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
