import React, {PropTypes} from 'react'
import LoginManager from './LoginManager'
import * as DataUtils from '../client_data'
import {getCookieByName} from '../utils'
import {detectLoginStatus} from '../../../electron/ipc_render'
import {
  ZHUANLAN_URL, LOGIN_URL, LOGOUT_URL, ZHIHU_DOMAIN, ZHIHU_XSRF_TOKEN_NAME,
  SUPPORT_PLATFORM_MAP
} from '../../helpers/const'

const PLATFORM_NAME = SUPPORT_PLATFORM_MAP.zhihu.name
const PLATFORM_LABEL = SUPPORT_PLATFORM_MAP.zhihu.label

function transformCookie(cookie) {
  return {
    cookie,
    token: getCookieByName(cookie, ZHIHU_XSRF_TOKEN_NAME)
  }
}

function getUsername(account) {
  return account.email
}

function onZhihuLoggedIn(props, {cookie, token, email, columns}) {
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

export default function createZhihuLoginPage(props) {
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
      loginUrl={LOGIN_URL}
      logoutUrl={LOGOUT_URL}
      loggedInUrl={ZHUANLAN_URL}
      domain={ZHIHU_DOMAIN}
      whoAmI={detectLoginStatus}
      onLoggedIn={onZhihuLoggedIn}
      transformCookie={transformCookie}
      getUsername={getUsername}
    >
      {tip}
    </LoginManager>
  )
}

createZhihuLoginPage.propTypes = {
  states: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}
