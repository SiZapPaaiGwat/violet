import React, {PropTypes} from 'react'
import LoginManager from './LoginManager'
import * as DataUtils from '../client_data'
import {checkIdentity} from '../../../electron/ipc_render'
import {
  SUPPORT_PLATFORM_MAP
} from '../../helpers/const'

const platform = SUPPORT_PLATFORM_MAP.jianshu
const PLATFORM_NAME = platform.name
const PLATFORM_LABEL = platform.label

function transformCookie(cookie) {
  return {
    cookie
  }
}

function onLoggedIn({cookie}, serverJson = {}) {
  // 验证服务端是否正常返回数据
  if (!serverJson.nickname) return null

  let account = {cookie, username: serverJson.nickname}
  DataUtils.updateAccount(PLATFORM_NAME, account)
  return account
}

export default function createLoginPage(props) {
  return (
    <LoginManager
      {...props}
      platformName={PLATFORM_NAME}
      platformLabel={PLATFORM_LABEL}
      loginUrl={platform.loginUrl}
      logoutUrl={platform.logoutUrl}
      loggedInUrl={platform.loggedInUrl}
      domain={platform.domain}
      whoAmI={checkIdentity}
      onLoggedIn={onLoggedIn}
      transformCookie={transformCookie}
    />
  )
}

createLoginPage.propTypes = {
  states: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}
