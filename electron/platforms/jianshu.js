import request from '../request'
import PlatformHandler from './handler'
import * as CONST from '../const'

function httpRequest({url, method = 'post', cookie, token, formData}) {
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
      Accept: 'application/json',
      Cookie: cookie,
      'X-CSRF-Token': token,
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// <meta name="csrf-token" content="XyKtaupu6qLb7A/LuwM0MAAIZAzTqVByRr6o+u4w==" />
function getNotebooks({cookie, token}) {
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
  return httpRequest({
    url: 'http://www.jianshu.com/writer/notebooks',
    method: 'get',
    cookie,
    token
  })
}

function createDraft({cookie, token, notebookId}) {
  // {
  //   "id": 4370114,
  //   "notebook_id": 4674624,
  //   "shared": false,
  //   "slug": "00913ecfd101",
  //   "seq_in_nb": -1,
  //   "note_type": "markdown",
  //   "content_updated_at": 1465908424,
  //   "last_compiled_at": 0,
  //   "content_size_status": "fine",
  //   "autosave_control": 0,
  //   "title": "无标题文章",
  //   "content": ""
  // }
  return httpRequest({
    url: 'http://www.jianshu.com/writer/notes',
    method: 'post',
    cookie,
    token,
    formData: {
      title: '无标题文章',
      notebook_id: notebookId,
      seq_in_nb: -1,
      id: 'c-7'
    }
  })
}

function updateDraft({cookie, token, notebookId, postId, slug, title, content}) {
  // {
  //     "id": 4370171,
  //     "notebook_id": 4674624,
  //     "shared": false,
  //     "slug": "114edb7f387b",
  //     "seq_in_nb": -2,
  //     "note_type": "markdown",
  //     "content_updated_at": 1465908747,
  //     "last_compiled_at": 0,
  //     "deleted_at": null,
  //     "content_size_status": "fine",
  //     "autosave_control": 2,
  //     "title": "无标题文章2",
  //     "content": "333"
  // }
  return httpRequest({
    url: 'http://www.jianshu.com/writer/notes/${postId}',
    method: 'put',
    cookie,
    token,
    formData: {
      title,
      content,
      slug,
      shared: false,
      notebook_id: notebookId,
      seq_in_nb: -2,
      note_type: 'markdown',
      autosave_control: 2,
      content_size_status: 'fine',
      last_compiled_at: 0,
      content_updated_at: 1465908745,
      deleted_at: null,
      id: postId
    }
  })
}

// Accept:application/json, text/javascript, */*; q=0.01
// Accept-Encoding:gzip, deflate, sdch
// Accept-Language:zh-CN,zh;q=0.8
// Cache-Control:max-age=0
// Connection:keep-alive
// Cookie:read_mode=day; default_font=font2; remember_user_token=W1szNDk3OF0sIiQyYSQxMCRCRlVoLlB
// Host:www.jianshu.com
// Referer:http://www.jianshu.com/writer
// User-Agent:
// X-CSRF-Token:
// X-Requested-With:XMLHttpRequest
// x-writer-version:16

export default class JianshuHandler extends PlatformHandler {
  static alias = 'jianshu'

  whoAmI() {
    let {cookie, token} = this
    if (!cookie || !token) {
      return Promise.reject(new Error('身份验证失败，请设置平台帐号或者注销重新登录'))
    }

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
    return httpRequest({
      url: 'http://www.jianshu.com/writer/users',
      method: 'get',
      cookie,
      token
    })
  }


  /**
   * 一点小区别：
   * 编辑器中的换行会被知乎忽略，而GitHub不会
   * 我们这里不做任何处理
   */
  publish() {
    let {cookie, token} = this
    if (!cookie || !token) {
      return Promise.reject(new Error('身份验证失败，请设置平台帐号或者注销重新登录'))
    }

    return httpRequest({
      url: 'http://www.jianshu.com/writer/notes/${postId}/publicize',
      method: 'post',
      cookie,
      token
    })
  }
}

PlatformHandler.link(JianshuHandler.alias, JianshuHandler)
