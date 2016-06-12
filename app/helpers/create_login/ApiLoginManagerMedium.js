import React from 'react'
import ApiLoginManager from './ApiLoginManager'
import * as DataUtils from '../client_data'

const PLATFORM_NAME = 'medium'
const PLATFORM_LABEL = 'Medium'

function updateAccount(name, clientData, serverData) {
  let account = Object.assign({}, clientData, serverData.data)
  DataUtils.updateAccount(name, account)
  return account
}

function transfromUsername(account) {
  return `${account.username}`
}

export default function(props) {
  let extendFields = [
    {
      name: 'accessToken',
      type: 'text',
      label: 'ACCESS TOKEN',
      placeholder: '请输入ACCESS TOKEN',
      required: true,
      value: ''
    }, {
      name: 'proxy',
      type: 'text',
      label: '代理地址',
      placeholder: '支持Shadowsocks代理，格式：socks://127.0.0.1:1080',
      required: true,
      value: 'socks://127.0.0.1:1080'
    }
  ]
  return (
    <ApiLoginManager
      {...props}
      extends={extendFields}
      platformName={PLATFORM_NAME}
      platformLabel={PLATFORM_LABEL}
      updateAccount={updateAccount}
      transfromUsername={transfromUsername}
    />
  )
}
