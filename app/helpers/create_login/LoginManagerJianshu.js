import React, {PropTypes} from 'react'
import LoginManager from './LoginManager'
import * as DataUtils from '../client_data'
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
  return account.nickname
}

function onLoggedIn(props, {cookie, nickname}) {
  let account = {cookie, nickname}
  DataUtils.updateAccount(PLATFORM_NAME, account)
  props.actions.accountUpdate({
    platform: PLATFORM_NAME,
    value: account
  })

  props.actions.statusUpdate({
    platform: PLATFORM_NAME,
    value: true
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
