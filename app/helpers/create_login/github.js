import React from 'react'
import ApiLoginManager from './ApiLoginManager'
import * as DataUtils from '../client_data'

const PLATFORM_NAME = 'github'
const PLATFORM_LABEL = 'GitHub'

function updateAccount(name, {username, password, repo}) {
  DataUtils.updateAccount(name, username, password, repo)
}

function transfromUsername(account) {
  return `${account.username}/${account.repo}`
}

export default function createGitHubPage(props) {
  let extendFields = [
    {
      name: 'username',
      type: 'text',
      label: '帐号',
      placeholder: '请输入登录帐号',
      required: true,
      value: ''
    }, {
      name: 'password',
      type: 'password',
      label: '密码',
      placeholder: '请输入密码',
      required: true,
      value: ''
    }, {
      name: 'repo',
      type: 'text',
      label: '仓库名',
      placeholder: '请输入GitHub仓库(repo)名称',
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
      updateAccount={updateAccount}
      transfromUsername={transfromUsername}
    />
  )
}
