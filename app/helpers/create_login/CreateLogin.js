import React from 'react'
import GitHubLoginPage from './ApiLoginManagerGitHub'
import ZhihuLoginPage from './LoginManagerZhihu'

export default function(pageName, props) {
  if (pageName === 'zhihu') {
    return <ZhihuLoginPage {...props} />
  } else if (pageName === 'github') {
    return <GitHubLoginPage {...props} />
  }

  return null
}
