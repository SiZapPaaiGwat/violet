import React from 'react'
import ApiLoginManager from './ApiLoginManager'
import * as DataUtils from '../client_data'
import {SUPPORT_PLATFORM_MAP} from '../../helpers/const'

const PLATFORM_NAME = SUPPORT_PLATFORM_MAP.medium.name
const PLATFORM_LABEL = SUPPORT_PLATFORM_MAP.medium.label

function onLoggedIn(clientData, serverData = {}) {
  if (!serverData.data) {
    console.error('服务端返回数据有误', serverData)
    return null
  }

  let account = Object.assign({}, clientData, serverData.data)
  DataUtils.updateAccount(PLATFORM_NAME, account)
  return account
}

export default function(props) {
  let extendFields = [
    {
      name: 'accessToken',
      type: 'text',
      label: 'ACCESS TOKEN',
      placeholder: '前往 https://medium.com/me/settings 底部Integration tokens添加',
      required: true,
      value: ''
    }, {
      name: 'proxy',
      type: 'text',
      label: '代理地址',
      placeholder: '支持常用的HTTP代理以及Shadowsocks代理，格式：socks://127.0.0.1:1080',
      required: true,
      value: ''
    }
  ]
  return (
    <ApiLoginManager
      {...props}
      extends={extendFields}
      platformName={PLATFORM_NAME}
      platformLabel={PLATFORM_LABEL}
      onLoggedIn={onLoggedIn}
    />
  )
}
