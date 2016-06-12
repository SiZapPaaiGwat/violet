import GitHubLoginPage from './ApiLoginManagerGitHub'
import ZhihuLoginPage from './LoginManagerZhihu'

export default function(pageName) {
  if (pageName === 'zhihu') {
    return ZhihuLoginPage
  } else if (pageName === 'github') {
    return GitHubLoginPage
  }

  return null
}
