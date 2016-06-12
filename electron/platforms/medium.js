import PlatformHandler from './handler'
import request from '../request'

export default class MediumHandler extends PlatformHandler {
  static alias = 'medium'

  isLoggedIn() {
    let {accessToken, proxy} = this
    if (!accessToken) {
      return Promise.resolve(false)
    }

    // {
    //   "data": {
    //     "id": "5303d74c64f66366f00cb9b2a94f3251bf5",
    //     "username": "majelbstoat",
    //     "name": "Jamie Talbot",
    //     "url": "https://medium.com/@majelbstoat",
    //     "imageUrl": "https://images.medium.com/0*fkfQiTzT7TlUGGyI.png"
    //   }
    // }
    return request({
      url: 'https://api.medium.com/v1/me',
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      proxy
    })
  }

  publish() {
    let {accessToken, title, content, key, proxy, userId} = this
    if (!accessToken || !title || !userId) {
      return Promise.resolve(null)
    }

    if (key) {
      // medium api 暂时不支持编辑，web页面请求参数比较变态
      return Promise.resolve(null)
    }

    return request({
      url: `https://api.medium.com/v1/users/${userId}/posts`,
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      formData: {
        title,
        content,
        contentFormat: 'markdown',
        tags: [],
        publishStatus: 'publish'
      },
      proxy
    }).then(json => {
      // {
      //  "data": {
      //    "id": "e6f36a",
      //    "title": "Liverpool FC",
      //    "authorId": "5303d74c64f66366f00cb9b2a94f3251bf5",
      //    "tags": ["football", "sport", "Liverpool"],
      //    "url": "https://medium.com/@majelbstoat/liverpool-fc-e6f36a",
      //    "canonicalUrl": "http://jamietalbot.com/posts/liverpool-fc",
      //    "publishStatus": "public",
      //    "publishedAt": 1442286338435,
      //    "license": "all-rights-reserved",
      //    "licenseUrl": "https://medium.com/policy/9db0094a1e0f"
      //  }
      // }
      return json.data.id
    })
  }
}

PlatformHandler.link(MediumHandler.alias, MediumHandler)
