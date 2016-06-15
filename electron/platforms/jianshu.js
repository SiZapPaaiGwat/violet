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

function createDraftContent({cookie, token, postId, version}) {
  return httpRequest({
    url: `http://www.jianshu.com/writer/notes/${postId}/content`,
    method: 'get',
    cookie,
    token,
    version
  })
}

function updateDraft({cookie, token, post, title, content, version}) {
  if (!post || !post.id) {
    return Promise.reject(new Error('内部错误:作品不存在'))
  }

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
      autosave_control : post.autosave_control + 1,
      content_updated_at : Math.ceil(Date.now() / 1000),
    }
  })
}

function getNotes({cookie, token, version}) {
  return httpRequest({
    url: 'http://www.jianshu.com/writer/notes',
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

  return getNotes({cookie, token, version}).then(json => {
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

function getColumns({cookie, token, version}) {
  // http://www.jianshu.com/writer/notebooks
  return httpRequest({
    url: 'http://www.jianshu.com/writer/notebooks',
    method: 'get',
    cookie,
    token,
    version
  }).then(columns => {
    return Promise.resolve(columns[0].id)
  })
}

// notebookId不传则发布到默认日记本
function publichOnCreate({cookie, notebookId, title, content}) {
  let baseSettings = {cookie}
  let post
  let promise
  let columnId

  return getVerAndToken({cookie}).then(json => {
    console.log('Done getting token and version')
    Object.assign(baseSettings, json)
    if (notebookId) {
      promise = Promise.resolve(notebookId)
    } else {
      promise = getColumns({
        cookie,
        token: baseSettings.token,
        version: baseSettings.version
      })
    }

    return promise
  }).then(id => {
    columnId = id
    return getSeqAndCid({
      ...baseSettings,
      notebookId: columnId
    })
  }).then(({seq, cid}) => {
    console.log('Done getting seq and cid')
    return createDraft({
      ...baseSettings,
      seq,
      cid,
      notebookId: columnId
    })
  }).then(json => {
    console.log('Done creating post')
    post = json
    return createDraftContent({
      ...baseSettings,
      postId: json.id
    })
  }).then(json => {
    console.log('Done creating post content')
    return updateDraft({
      ...baseSettings,
      post,
      title,
      content
    })
  }).then(json => {
    console.log('Done updating post title')
    return httpRequest({
      ...baseSettings,
      url: `http://www.jianshu.com/writer/notes/${json.id}/publicize`,
      method: 'post'
    })
  }).then(json => {
    console.log('Done publicizing post')
    return Promise.resolve(json.note.id)
  })
}

function publishOnEdit({cookie, title, content, key}) {
  let baseSettings = {cookie}
  return getVerAndToken({cookie}).then(json => {
    console.log('Done getting token and version')
    Object.assign(baseSettings, json)
    return getNotes(baseSettings)
  }).then(notes => {
    console.log('Done getting posts')
    let posts = notes.filter(item => {
      return item.id === key
    })

    if (posts.length === 0) {
      return Promise.reject(new Error('作品不存在，可能已经被删除'))
    }

    return updateDraft({
      ...baseSettings,
      post: posts[0],
      title, content
    })
  }).then(json => {
    console.log('Done updating post title and content')
    return httpRequest({
      ...baseSettings,
      url: `http://www.jianshu.com/writer/notes/${json.id}/compile`,
      method: 'post'
    })
  }).then(json => {
    console.log('Done compiling post')
    return Promise.resolve(json.id)
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
    let {cookie, title, content, key, notebookId} = this
    if (!cookie) {
      return Promise.reject(new Error('身份验证失败，请设置平台帐号或者注销重新登录'))
    }
    if (!content || !title) {
      return Promise.reject(new Error('标题和内容均不能为空'))
    }

    let params = {cookie, title, content, notebookId}
    if (!key) {
      return publichOnCreate(params)
    }

    return publishOnEdit({
      ...params,
      key
    })
  }
}

PlatformHandler.link(JianshuHandler.alias, JianshuHandler)
