import request from '../request'
import PlatformHandler from './handler'
// import * as CONST from '../const'

const HUMAN_HEADERS = {
  Accept: '*/*',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'zh-CN,zh;q=0.8',
  Connection: 'keep-alive',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36',
}

function httpRequest({url, method = 'post', cookie, token, formData, version}) {
  if (!url) {
    return Promise.reject(new Error('Request url is empty'))
  }

  if (!cookie) {
    return Promise.reject(new Error(`Request header cookie is empty.\nURL is ${url}`))
  }

  if (!token) {
    return Promise.reject(new Error(`Request header token is empty and your cookie is ${cookie}`))
  }

  return request({
    url,
    method,
    formData,
    headers: {
      ...HUMAN_HEADERS,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Cookie: cookie,
      // Host: 'www.jianshu.com',
      // Origin: 'http://www.jianshu.com',
      // Referer: 'http://www.jianshu.com/writer',
      'X-CSRF-Token': token,
      'X-Requested-With': 'XMLHttpRequest',
      'x-writer-version': version
    }
  })
}

// NOTE
// <div id="writer" class="container-fluid" data-writer-version=38>
// <meta name="csrf-token" content="XyKtaupu6qLb7A/LuwM0MAAIZAzTqVByRr6o+u4w==" />

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
  return httpRequest({
    url: 'http://www.jianshu.com/writer/notes',
    method: 'get',
    cookie,
    token,
    version
  }).then(json => {
    console.log(json)
    // 最后一条记录的
    let notes = json.filter(item => {
      return item.notebook_id === notebookId
    }).sort((a, b) => {
      return a.seq_in_nb > b.seq_in_nb
    })
    return Promise.resolve({
      cid: `c-${json.length}`,
      seq: notes.length ? notes[0].seq_in_nb : -1
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
    }
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
    // {
    //     "id": 34978,
    //     "preferred_note_type": "markdown",
    //     "nickname": "高梵梵高",
    //     "slug": "3a1021e6c75f",
    //     "avatar": "",
    //     "read_mode": "day",
    //     "default_font": "font1",
    //     "is_internal_user": false
    // }
    return this.checkIdentity().then((cookie, token) => {
      return httpRequest({
        url: 'http://www.jianshu.com/writer/users',
        method: 'get',
        cookie,
        token
      })
    })
  }

  listColumns() {
    //     "id": 66305,
    //     "name": "草稿",
    //     "user_id": 34978,
    //     "created_at": "2014-03-04T14:14:59.000+08:00",
    //     "updated_at": "2014-03-04T14:14:59.000+08:00",
    //     "seq": null,
    //     "has_update_at": 0,
    //     "likes_count": 0,
    //     "deleted_at": null,
    //     "last_published_at": null
    return this.checkIdentity().then((cookie, token) => {
      return httpRequest({
        url: 'http://www.jianshu.com/writer/notebooks',
        method: 'get',
        cookie,
        token
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
      }).catch(err => {
        console.log(err)
      })
    }

    return console.log('TODO')
  }
}

// node -r babel-register ./electron/platforms/jianshu
let instance = new JianshuHandler({
  title: 'vilolet11111',
  content: '## violet alpha now \n > hello violet!',
  cookie: '',
  notebookId: 4677726,
})
instance.publish().then(() => {
  console.log('DONE')
}).catch(err => {
  console.log(err.status)
  console.log(err.response.text)
  console.log(err.message)
})
