import request from 'superagent'
import proxilize from 'superagent-proxy'
import {REQUEST_TIMEOUT} from '../app/helpers/const'

proxilize(request)

export default function({url, method, formData, headers, timeout = REQUEST_TIMEOUT, proxy}) {
  return new Promise((resolve, reject) => {
    let req = request[method]
    if (!req) {
      reject(new Error(`Unsupported request method: ${method}`))
      return
    }

    try {
      req = req(url)
      // socks://127.0.0.1:1080/ for shadowsocks proxy
      if (proxy) {
        req.proxy(proxy)
      }
      req.send(formData)
      req.timeout(timeout)

      for (let header in headers) {
        req.set(header, headers[header])
      }
    } catch (err) {
      reject(err)
      return
    }

    req.end((err, res) => {
      if (err) {
        reject(err instanceof Error ? err : new Error(JSON.stringify(err)))
        return
      }

      resolve(res)
    })
  })
}
