import marked from 'marked'
import request from '../request'
import PlatformHandler from './handler'
import {SUPPORT_PLATFORM_MAP} from '../const'

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
})

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
      [SUPPORT_PLATFORM_MAP.zhihu.csrfTokenName]: token,
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 更新文章（草稿状态，未发布）
 * 这个请求不用返回数据
 */
function updatePostContent({cookie, token, title, content, key}) {
  return httpRequest({
    cookie,
    token,
    method: 'patch',
    url: `https://zhuanlan.zhihu.com/api/drafts/${key}`,
    formData: {
      title, content
    }
  })
}

/**
 * 获取知乎草稿id
 */
function getZhihuDrafts({cookie, token, title, content}) {
  return httpRequest({
    url: 'https://zhuanlan.zhihu.com/api/drafts',
    formData : {
      topics: [],
      titleImage: '',
      column: '',
      isTitleImageFullScreen: false,
      content,
      title
    },
    method: 'post',
    cookie,
    token
  })
}

function getZhihuColumns({cookie, token}) {
  return httpRequest({
    cookie,
    token,
    method: 'get',
    url: 'https://zhuanlan.zhihu.com/api/me/available_columns'
  })
}

export default class ZhihuHandler extends PlatformHandler {
  static alias = 'zhihu'

  whoAmI() {
    let {cookie, token} = this
    if (!cookie || !token) {
      return Promise.resolve(null)
    }

    return httpRequest({
      url: 'https://zhuanlan.zhihu.com/api/me',
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
    let {cookie, token, title, content, key, column} = this
    if (!cookie || !token || !title) {
      return Promise.resolve(null)
    }

    content = marked(content).trim()
    let task = key ?
      updatePostContent({cookie, token, title, content, key}) :
      getZhihuDrafts({cookie, token, title, content})

    return Promise.all([
      task,
      getZhihuColumns({cookie, token})
    ]).then(function([draftInfo, columnsInfo]) {
      let id = key || draftInfo.id
      let url = `https://zhuanlan.zhihu.com/api/drafts/${id}/publish`
      column = column || (columnsInfo && columnsInfo[0])

      if (!column) {
        return Promise.reject(new Error('当前帐号没有开通知乎专栏'))
      }

      return httpRequest({
        url,
        method: 'put',
        cookie,
        token,
        formData: {
          author: column.creator,
          canTitleImageFullScreen: false,
          column,
          content,
          id,
          isTitleImageFullScreen: false,
          sourceUrl: '',
          state: 'published',
          title,
          titleImage: '',
          topics: column.topics,
          updateTime: new Date().toISOString()
        }
      }).then(json => {
        return json.slug
      })
    })
  }
}

PlatformHandler.link(ZhihuHandler.alias, ZhihuHandler)
