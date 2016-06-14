import React, {PropTypes} from 'react'
import LoginManager from './LoginManager'
import * as DataUtils from '../client_data'
// import {getCookieByName} from '../utils'
import {detectLoginStatus} from '../../../electron/ipc_render'
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

  let hasColumns = columns && columns.length > 0
  props.actions.statusUpdate({
    platform: PLATFORM_NAME,
    // TODO 这里直接false，登录态根据本地数据，这里表示是否可以同步
    value: {
      writable: hasColumns
    }
  })
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
      whoAmI={detectLoginStatus}
      onLoggedIn={onLoggedIn}
      transformCookie={transformCookie}
      getUsername={getUsername}
    />
  )
}

createLoginPage.propTypes = {
  states: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}
