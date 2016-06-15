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
  return {
    cookie,
    token: getCookieByName(cookie, platform.csrfTokenName)
  }
}

function getUsername(account) {
  return account.email
}

function onLoggedIn(props, {cookie, token, email, columns}) {
  let account = {cookie, token, email}
  DataUtils.updateAccount(PLATFORM_NAME, account)
  props.actions.accountUpdate({
    platform: PLATFORM_NAME,
    value: account
  })

  // 没有开通专栏
  let hasColumns = columns && columns.length > 0
  props.actions.statusUpdate({
    platform: PLATFORM_NAME,
    value: {
      writable: hasColumns
    }
  })
}

export default function createLoginPage(props) {
  let status = props.states.status
  let tip = status[PLATFORM_NAME] && !status[PLATFORM_NAME].writable ? (
    <div>
      <em style={{color: 'red'}}>当前帐号未开通专栏，无法向此平台同步作品。请先开通专栏然后注销重新登录</em>
    </div>
  ) : null

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
      getUsername={getUsername}
    >
      {tip}
    </LoginManager>
  )
}

createLoginPage.propTypes = {
  states: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}
