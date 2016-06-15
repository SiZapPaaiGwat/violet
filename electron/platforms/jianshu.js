import request from '../request'
import PlatformHandler from './handler'
import {UA} from '../const'

const HUMAN_HEADERS = {
  Accept: '*/*',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'zh-CN,zh;q=0.8',
  Connection: 'keep-alive',
  'User-Agent': UA,
}

function httpRequest({url, method = 'post', cookie, token = null, formData, version, xhr = true}) {
  if (!url) {
    return Promise.reject(new Error('Request url is empty'))
  }

  if (!cookie) {
    return Promise.reject(new Error(`Request header cookie is empty.\nURL is ${url}`))
  }

  let headers = {
    ...HUMAN_HEADERS,
    Cookie: cookie
  }

  if (xhr) {
    if (!token || !version) {
      return Promise.reject(new Error('Token and version are required arguments'))
    }

    Object.assign(headers, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-Token': token,
      'X-Requested-With': 'XMLHttpRequest',
      'x-writer-version': version
    })
  }

  return request({
    url,
    method,
    formData,
    headers
  })
}

function createDraft({cookie, token, notebookId, seq, cid, version}) {
  return httpRequest({
    url: 'http://www.jianshu.com/writer/notes',
    method: 'post',
    cookie,
    token,
    version,
    formData: {
      title: '无标题文章',
      notebook_id: notebookId,
      seq_in_nb: seq,
      id: cid
    }
  })
}

function updateDraft({cookie, token, post, title, content, version}) {
  return httpRequest({
    url: `http://www.jianshu.com/writer/notes/${post.id}`,
    method: 'put',
    cookie,
    token,
    version,
    formData: {
      ...post,
      title,
      content,
      autosave_control : 1,
      content_updated_at : Math.ceil(Date.now() / 1000),
    }
  })
}

function setContent({cookie, token, postId, version}) {
  return httpRequest({
    url: `http://www.jianshu.com/writer/notes/${postId}/content`,
    method: 'get',
    cookie,
    token,
    version
  })
}

/**
 * seq用于记录作品在列表中的位置
 * cid表示文章的序号
 */
function getSeqAndCid({cookie, token, version, notebookId}) {
  if (!notebookId) {
    return Promise.reject(new Error('内部错误：notebookId为空'))
  }

  return httpRequest({
    url: 'http://www.jianshu.com/writer/notes',
    method: 'get',
    cookie,
    token,
    version
  }).then(json => {
    // 最后一条记录的
    let notes = json.filter(item => {
      return item.notebook_id === notebookId && item.seq_in_nb < 0
    }).sort((a, b) => {
      return a.seq_in_nb - b.seq_in_nb
    })
    return Promise.resolve({
      cid: `c-${json.length}`,
      seq: notes.length ? notes[0].seq_in_nb - 1 : -1
    })
  })
}

function getVerAndToken({cookie}) {
  return request({
    url: 'http://www.jianshu.com/writer',
    method: 'get',
    headers: {
      ...HUMAN_HEADERS,
      Cookie: cookie
    },
    xhr: false
  }).then(res => {
    try {
      let html = res.text
      let versionReg = / data-writer-version=['"]{0,1}(\d+)['"]{0,1}/
      let tokenReg = /<meta +name=['"]{0,1}csrf-token['"]{0,1} +content=['"]{0,1}(.+)['"]{0,1}/
      return Promise.resolve({
        version: html.match(versionReg)[1],
        token: html.match(tokenReg)[1]
      })
    } catch (err) {
      return Promise.reject(new Error('正则解析出错'))
    }
  })
}

export default class JianshuHandler extends PlatformHandler {
  static alias = 'jianshu'

  checkIdentity() {
    let {cookie} = this
    if (!cookie) {
      return Promise.reject(new Error('身份验证失败，请设置平台帐号或者注销重新登录'))
    }

    return Promise.resolve({cookie})
  }

  whoAmI() {
    let {cookie} = this
    return this.checkIdentity().then(() => {
      return getVerAndToken({cookie})
    }).then(({token, version}) => {
      return httpRequest({
        url: 'http://www.jianshu.com/writer/users',
        method: 'get',
        cookie,
        token,
        version
      })
    })
  }

  listColumns() {
    let {cookie} = this
    return this.checkIdentity().then(() => {
      return getVerAndToken({cookie})
    }).then(({token, version}) => {
      return httpRequest({
        url: 'http://www.jianshu.com/writer/notebooks',
        method: 'get',
        cookie,
        token,
        version
      })
    })
  }

  publish() {
    let {cookie, title, content, key, notebookId = 4677726} = this
    if (!cookie) {
      return Promise.reject(new Error('身份验证失败，请设置平台帐号或者注销重新登录'))
    }
    if (!content || !title) {
      return Promise.reject(new Error('标题和内容均不能为空'))
    }

    let baseSettings = {cookie}

    if (!key) {
      let post
      return getVerAndToken({cookie}).then(json => {
        Object.assign(baseSettings, json)
        console.log('version token is ', json)
        return getSeqAndCid({
          ...baseSettings,
          notebookId
        })
      }).then(json => {
        console.log('preparing')
        return createDraft({
          ...json,
          ...baseSettings,
          notebookId
        })
      }).then(json => {
        console.log('created')
        post = json
        return setContent({
          ...baseSettings,
          postId: json.id
        })
      }).then(json => {
        console.log('content set')
        return updateDraft({
          ...baseSettings,
          post,
          title,
          content
        })
      }).then(json => {
        console.log('json updated')
        return httpRequest({
          ...baseSettings,
          url: `http://www.jianshu.com/writer/notes/${json.id}/publicize`,
          method: 'post'
        })
      })
    }

    return console.log('TODO')
  }
}

PlatformHandler.link(JianshuHandler.alias, JianshuHandler)

// node -r babel-register ./electron/platforms/jianshu
// let instance = new JianshuHandler({
//   title: 'vilolet11111',
//   content: '## violet alpha now \n > hello violet!',
//   cookie: '',
//   notebookId: 4677726,
// })
// instance.publish().then(() => {
//   console.log('DONE')
// }).catch(err => {
//   console.log(err.status)
//   console.log(err.response.text)
//   console.log(err.message)
// })
