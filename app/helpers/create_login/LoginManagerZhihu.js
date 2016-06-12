import React, {PropTypes} from 'react'
import LoginManager from './LoginManager'
import * as DataUtils from '../client_data'
import {getCookieByName} from '../utils'
import {whoAmI} from '../../../electron/ipc_render'
import {
  ZHUANLAN_URL, LOGIN_URL, LOGOUT_URL, ZHIHU_DOMAIN, ZHIHU_XSRF_TOKEN_NAME
} from '../../helpers/const'

const PLATFORM_NAME = 'zhihu'
const PLATFORM_LABEL = '知乎'

function transformCookie(cookie) {
  return {
    cookie,
    token: getCookieByName(cookie, ZHIHU_XSRF_TOKEN_NAME)
  }
}

function onZhihuLoggedIn(props, json) {
  let hasColumns = json && json.columns.length !== 0
  props.actions.accountUpdate({
    platform: PLATFORM_NAME,
    value: {
      username: json.email,
      password: ''
    }
  })
  DataUtils.updateAccount(PLATFORM_NAME, json.email, '')
  props.actions.statusUpdate({
    platform: PLATFORM_NAME,
    value: {
      writable: hasColumns
    }
  })

  if (!hasColumns) {
    App.alert('友情提醒', `该帐户${json.email}还没有开通专栏，请先前往 https://zhuanlan.zhihu.com/request 开通`, 'warning')
  }
}

export default function createZhihuLoginPage(props) {
  let status = props.states.status
  let tip = !status.zhihu.writable ? (
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
      whoAmI={whoAmI}
      onLoggedIn={onZhihuLoggedIn}
      transformCookie={transformCookie}
    >
      {tip}
    </LoginManager>
  )
}

createZhihuLoginPage.propTypes = {
  states: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}
