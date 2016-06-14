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

export default class JianshuHandler extends PlatformHandler {
  static alias = 'jianshu'

  checkIdentity() {
    let {cookie, token} = this
    if (!cookie || !token) {
      return Promise.reject(new Error('身份验证失败，请设置平台帐号或者注销重新登录'))
    }

    return Promise.resolve({cookie, token})
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
    let {cookie, token, title, content, key, notebookId, version} = this
    if (!cookie || !token) {
      return Promise.reject(new Error('身份验证失败，请设置平台帐号或者注销重新登录'))
    }
    if (!content || !title) {
      return Promise.reject(new Error('标题和内容均不能为空'))
    }

    let baseSettings = {cookie, token, version}

    if (!key) {
      let post
      return getSeqAndCid({
        ...baseSettings,
        notebookId
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

// node -r babel-register ./electron/test
// let instance = new JianshuHandler({
//   title: 'vilolet11111',
//   content: '## violet alpha now \n > hello violet!',
//   cookie: 'read_mode=day; default_font=font2; remember_user_token=W1szNDk3OF0sIiQyYSQxMCRCRlVoLlB4RlVjSFpxM0Uvb00vb0R1IiwiMTQ2NTU1NTU1MS40MzIyNzE3Il0%3D--7bc8ab304ae5462f0ca5d8b56a6b6edfb2bf4e3b; Hm_lvt_0c0e9d9b1e7d617b3e6842e85b9fb068=1465555513,1465917077; Hm_lpvt_0c0e9d9b1e7d617b3e6842e85b9fb068=1465917077; __utmt=1; __utma=194070582.799925090.1461696699.1465917081.1465922712.8; __utmb=194070582.7.10.1465922712; __utmc=194070582; __utmz=194070582.1465917081.7.3.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __utmv=194070582.|2=User%20Type=Member=1; _session_id=cnhaQi84RjdoYXVFcGMrL0dGbkVaWmlob0ViY3pWTUVtMlp0cGNKenc4ekhpUWZBSHJoTCtFcE56dkpyc1JpUnpoZEQwejc2V2svTzJGeUIzbmw0cGlqME5pQlhmK3JZUU1tbVYwNWdxbVVrSXFiSVZxaTFHQlY4bEprOXVvaVpVSEhjWlpvWktrVUVLMkc0SmdYZXB3UGNxTTFJdDlsd3oyT0ZxeVJoc2xyb0FnZ2lzV3BHSGVjSnNpdFRPN2lGb051czYyUEZPclo4MXRYS1gvM093OUNtdG51Q1Y5QXNuajN3TzFDUkF1cFJVYUplQTQvdVMxQUdUK0RFaGxjUHZSbjBOdXhCV3JyazJNU04zVmZQRkNESFNhb1cvSFFLdzVEUEZZbHJCY2h6WmJyYW1vOVVUckd4ODdES09IQTNXSUgyenpKSXVnc01sSUM0VjFOeFFpVERwVkQrbFFFekgwc2xycXdQcEZGczh1THZLY3g3SmFpNkVMVlN1QlpFY2tMUWRMb1lVbFljTFh2N0RuWXNwUE5CWmRaWDl1Nm95NFp1b05oN1lTUFpoZ2Q3UEhDcjkrbjAzRGJteVVHdVlVNUxJblB4eFRScjR5QkZ1N00wSFNGK0U1U2dHcm1iRldMaGdBaWkwUVE9LS1pWUUwMUhJUjRQdzliUDRydVR2T3RBPT0%3D--d370960afb20408e4042a39ec4afcab01042ba1e',
//   token: 'J5i/O+UR78kTk3L6qFhzvmkErSoaqfMxXvNti3drX5yELD7yC4V7n1qiGpHY54AVb+N9wT3+Sf+D9cfVogmAcQ==',
//   notebookId: 4677726,
//   version: 75
// })
// instance.publish().then(() => {
//   console.log('DONE')
// }).catch(err => {
//   console.log(err.status)
//   console.log(err.response.text)
//   console.log(err.message)
// })

request({
  url: 'http://www.jianshu.com/writer',
  method: 'get',
  headers: {
    ...HUMAN_HEADERS,
    Cookie: instance.cookie
  }
}).then(res => {
  let html = res.text
  console.log(html)
  console.log(html.indexOf('data-writer-version'))
}).catch(err => {
  console.log(err)
})
