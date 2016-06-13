import GitHubAPI from 'github'
import PlatformHandler from './handler'
import {REQUEST_TIMEOUT} from '../const'

export default class GitHubHandler extends PlatformHandler {
  static alias = 'github'

  /**
   * 这个方法用于验证当前账户信息是否有效
   * 因为输入的是账户名密码所以没有必要获取服务端数据
   */
  whoAmI() {
    let {username, password, repo} = this
    return new Promise((resolve, reject) => {
      if (!username || !password || !repo) {
        resolve(false)
        return
      }

      let github = new GitHubAPI({
        version: '3.0.0',
        protocol: 'https',
        timeout: REQUEST_TIMEOUT
      })

      github.authenticate({
        type: 'basic',
        username,
        password
      })

      github.repos.get({
        user: username,
        repo
      }, function(err, result) {
        if (err || !result) {
          resolve(false)
          return
        }

        resolve(username)
      })
    })
  }

  publish() {
    let {username, password, title, content, repo, key} = this
    if (!username || !password || !repo || !title) {
      return Promise.resolve(null)
    }

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

        resolve(result.number)
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
}

PlatformHandler.link(GitHubHandler.alias, GitHubHandler)
