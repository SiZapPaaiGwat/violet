import GitHubLoginPage from './ApiLoginManagerGitHub'
import MediumLoginPage from './ApiLoginManagerMedium'
import ZhihuLoginPage from './LoginManagerZhihu'

export default function(pageName) {
  if (pageName === 'zhihu') {
    return ZhihuLoginPage
  } else if (pageName === 'github') {
    return GitHubLoginPage
  } else if (pageName === 'medium') {
    return MediumLoginPage
  }

  return null
}
