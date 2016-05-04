import request from 'superagent'

/**
 * 获取知乎草稿id
 */
export function getZhihuDrafts(cookie, csrfToken) {
  return new Promise(function(resolve, reject) {
    let formData = {
      topics: [],
      title: '1',
      content: '',
      titleImage: '',
      column: '',
      isTitleImageFullScreen: false
    }

    request.post('https://zhuanlan.zhihu.com/api/drafts')
      .send(formData)
      .set('X-XSRF-TOKEN', csrfToken)
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json;charset=UTF-8')
      .end(function(err, res) {
        if (err) {
          reject(err)
          return
        }

        resolve(JSON.parse(res.text))
      })
  })
}
