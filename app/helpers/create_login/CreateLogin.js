import GitHubLoginPage from './ApiLoginManagerGitHub'
import MediumLoginPage from './ApiLoginManagerMedium'
import ZhihuLoginPage from './LoginManagerZhihu'
import JianshuLoginPage from './LoginManagerJianshu'

export default function(pageName) {
  if (pageName === 'zhihu') {
    return ZhihuLoginPage
  } else if (pageName === 'github') {
    return GitHubLoginPage
  } else if (pageName === 'medium') {
    return MediumLoginPage
  } else if (pageName === 'jianshu') {
    return JianshuLoginPage
  }

  return null
}
