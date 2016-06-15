import React, {PropTypes} from 'react'
import LoginManager from './LoginManager'
import * as DataUtils from '../client_data'
import {getCookieByName} from '../utils'
import {checkIdentity} from '../../../electron/ipc_render'
import {SUPPORT_PLATFORM_MAP} from '../../helpers/const'

const platform = SUPPORT_PLATFORM_MAP.zhihu
const PLATFORM_NAME = platform.name
const PLATFORM_LABEL = platform.label

function transformCookie(cookie) {
  let token = getCookieByName(cookie, platform.csrfTokenName.replace('X-', ''))
  if (!token) {
    throw new Error('内部错误：无法获取zhihu的CSRF Token')
  }

  return {
    cookie,
    token
  }
}

function onLoggedIn({cookie, token}, serverJson) {
  let username = serverJson.email || serverJson.name || serverJson.slug
  if (!username) {
    console.error('服务端json返回有误', serverJson)
    return null
  }

  let account = {
    cookie, token, username
  }

  DataUtils.updateAccount(PLATFORM_NAME, account)

  // 没有开通专栏
  let hasColumns = serverJson.columns && serverJson.columns.length > 0
  if (!hasColumns) {
    App.alert('温馨提醒', '当前帐号还没有开通专栏，作品将无法同步请知悉')
  }

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
