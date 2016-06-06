import request from 'superagent'
import GitHubAPI from 'github'
import {getCookieByName, cookieTokenUtil} from '../app/helpers/utils'
import {ZHIHU_XSRF_TOKEN_NAME} from '../app/helpers/const'

/**
 * 用于请求知乎的相关接口
 */
export function requestWithParams({url, cookie, token, formData, method}) {
  return new Promise(function(resolve, reject) {
    request[method || 'post'](url)
      .send(formData)
      .set(`X-${ZHIHU_XSRF_TOKEN_NAME}`, token)
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json;charset=UTF-8')
      .timeout(15000)
      .end(function(err, res) {
        if (err) {
          reject(err)
          return
        }

        let json = JSON.parse(res.text)
        // 更新cookie与token，不过这里暂时没用
        json.csrfToken = getCookieByName(res.headers['set-cookie'].join('; '),
          ZHIHU_XSRF_TOKEN_NAME)
        json.cookie = cookieTokenUtil(cookie, json.csrfToken).cookie
        resolve(json)
      })
  })
}

export function whoAmI({cookie, token}) {
  return requestWithParams({
    url: 'https://zhuanlan.zhihu.com/api/me',
    method: 'get',
    cookie,
    token
  })
}

/**
 * 获取知乎草稿id
 */
export function getZhihuDrafts(cookie, token, title, content) {
  return requestWithParams({
    url: 'https://zhuanlan.zhihu.com/api/drafts',
    formData : {
      topics: [],
      titleImage: '',
      column: '',
      isTitleImageFullScreen: false,
      content,
      title
    },
    cookie,
    token
  })
}

// http://tool.oschina.net/codeformat/json
// [{"followersCount": 37, "creator": {"bio": "\u770b\u4e09\u505a\u4e8c\u8bf4\u4e00 https://github.com/simongfxu", "hash": "75f1c2aa7927f7dbeb8d5cfe702fc92d", "description": "https://github.com/simongfxu", "profileUrl": "https://www.zhihu.com/people/reduxis", "avatar": {"id": "9a20d473d826eb58e1507da1bcc4027e", "template": "https://pic3.zhimg.com/{id}_{size}.jpg"}, "slug": "reduxis", "name": "\u9ad8\u51e1"}, "topics": [{"url": "https://www.zhihu.com/topic/19550516", "id": "19550516", "name": "Web \u5f00\u53d1"}, {"url": "https://www.zhihu.com/topic/20013159", "id": "20013159", "name": "React"}, {"url": "https://www.zhihu.com/topic/19552521", "id": "19552521", "name": "JavaScript"}], "activateState": "activated", "href": "/api/columns/reduixs", "acceptSubmission": true, "postTopics": [{"postsCount": 1, "id": 769, "name": "JavaScript"}, {"postsCount": 1, "id": 156416, "name": "React"}], "pendingName": "", "avatar": {"id": "f12f6dac2267cefdbabe1b16808c7694", "template": "https://pic1.zhimg.com/{id}_{size}.jpeg"}, "canManage": true, "description": "\u9ad8\u51e1@DataEye\uff0c\u5173\u6ce8Web\u524d\u7aef\u524d\u6cbf\u6280\u672f\u3002\nhttps://github.com/simongfxu", "pendingTopics": [], "nameCanEditUntil": 0, "reason": "\u8f6f\u4ef6\u5f00\u53d1-\u524d\u7aef\u6280\u672f", "banUntil": 0, "slug": "reduixs", "name": "\u300eReactive Now\u300f", "url": "/reduixs", "intro": "\u9ad8\u51e1@DataEye\uff0c\u5173\u6ce8Web\u524d\u7aef\u524d\u6cbf\u6280\u672f\u3002\n\u2026", "topicsCanEditUntil": 0, "activateAuthorRequested": "none", "commentPermission": "anyone", "following": false, "postsCount": 3, "canPost": true}]
export function getZhihuColumns(cookie, token, slug) {
  return requestWithParams({
    cookie,
    token,
    method: 'get',
    url: 'https://zhuanlan.zhihu.com/api/me/available_columns'
  })
}

export function publishGitHub({username, password, title, content, repo, key}) {
  console.log(`key is ${key}`)
  return new Promise(function(resolve, reject) {
    let github = new GitHubAPI({
      version: '3.0.0',
      protocol: 'https',
      timeout: 15000
    })
    github.authenticate({
      type: 'basic',
      username,
      password
    })

    let handler = function(err, result) {
      if (err) {
        reject(err)
        return
      }

      resolve(result)
    }
    if (!key) {
      github.issues.create({
        user: username,
        repo,
        title,
        body: content
      }, handler)
    } else {
      github.issues.edit({
        user: username,
        repo,
        title,
        body: content,
        number: key
      }, handler)
    }
  })
}

export function updatePostContent(cookie, token, title, content, key) {
  return requestWithParams({
    cookie,
    token,
    method: 'patch',
    url: `https://zhuanlan.zhihu.com/api/drafts/${key}`
  })
}

// edit zhihu
// https://zhuanlan.zhihu.com/api/drafts/21254014
export function publishZhihu(cookie, token, title, content, key) {
  let task = key ? updatePostContent(cookie, token, title, content, key) :
    getZhihuDrafts(cookie, token, title, content)
  return Promise.all([
    task,
    getZhihuColumns(cookie, token)
  ]).then(function([draftInfo, columnsInfo]) {
    let id = key || draftInfo.id
    let url = `https://zhuanlan.zhihu.com/api/drafts/${id}/publish`
    return requestWithParams({
      url,
      method: 'put',
      cookie,
      token,
      formData: {
        author: columnsInfo[0].creator,
        canTitleImageFullScreen: false,
        column: columnsInfo[0],
        content,
        id,
        isTitleImageFullScreen: false,
        sourceUrl: '',
        state: 'published',
        title,
        titleImage: '',
        topics: columnsInfo[0].topics,
        updateTime: new Date().toISOString()
      }
    })
  })
}

// 检测知乎是否正确登录
export function isZhihuLoggin(cookie) {
  return new Promise((resolve, reject) => {
    request.get('https://zhuanlan.zhihu.com/api/me')
    .set('Cookie', cookie)
    .set('Content-Type', 'application/json;charset=UTF-8')
    .end((err, res) => {
      if (!err) {
        try {
          let result = JSON.parse(res.text)
          if (result && result.email) {
            resolve(true)
          }
        } catch (e) {
          resolve(false)
        }
      } else {
        resolve(false)
      }
    })
  })
}

export function isGitHubLoggin(username, password) {
  return new Promise((resolve, reject) => {
    let github = new GitHubAPI({
      version: '3.0.0',
      protocol: 'https',
      timeout: 15000
    })

    // github api will throw error, just resolve asap
    if (!username || !password) {
      resolve(false)
      return
    }

    github.authenticate({
      type: 'basic',
      username,
      password
    })
    github.user.getEmails({}, function(err, result) {
      if (err) {
        resolve(false)
        return
      }

      resolve(true)
    })
  })
}
