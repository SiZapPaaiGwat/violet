import request from 'superagent'
import {REQUEST_TIMEOUT} from '../app/helpers/const'

export default function({url, method, formData, headers, timeout = REQUEST_TIMEOUT}) {
  return new Promise((resolve, reject) => {
    let req = request[method]
    if (!req) {
      reject(new Error(`Unsupported request method: ${method}`))
      return
    }

    try {
      req = req(url)
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
