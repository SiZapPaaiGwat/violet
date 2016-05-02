import React from 'react'
import {Tabs, Alert} from 'antd'
import {encrypt, decrypt} from '../helpers/aes'
import AccountPasswordForm from '../components/Form'
import Todo from '../components/Todo'
import {SYNC_PLATFORMS, PLATFORM_INFO} from '../helpers/const'

export let accountMap = {}

const TabPane = Tabs.TabPane
const SPLIT_FLAG = '\n'

// 获取帐号配置信息
SYNC_PLATFORMS.forEach((platform) => {
  let pair = localStorage.getItem(platform) || ''
  pair = pair && decrypt(pair).split(SPLIT_FLAG)
  accountMap[platform] = {
    userName: pair && pair[0],
    password: pair && pair[1]
  }
})

function savePlatformAccount(platform, userName, password) {
  if (!userName || !password) {
    return
  }

  localStorage.setItem(platform, encrypt(`${userName}${SPLIT_FLAG}${password}`))
  accountMap[platform].userName = userName
  accountMap[platform].password = password
}

function removePlatform(platform) {
  accountMap[platform] = {userName: '', password: ''}
  localStorage.removeItem(platform)
}


export default React.createClass({
  handleZhihu(userName, password) {
    savePlatformAccount('zhihu', userName, password)
  },

  handleGitHub(userName, password) {
    savePlatformAccount('github', userName, password)
  },

  cancelZhihu() {
    removePlatform('zhihu')
  },

  cancelGitHub() {
    removePlatform('github')
  },

  render() {
    return (
      <div className="container-padding">
        <Alert
          message="同步设置"
          description="同步的各个平台帐号和密码使用加密技术存储在本地，无需担心密码泄露"
          type="info"
        />

        <Tabs defaultActiveKey="1">
          <TabPane tab={PLATFORM_INFO.zhihu.name} key="1">
            <AccountPasswordForm
              handleSubmit={this.handleZhihu}
              handleCancel={this.cancelZhihu}
              userName={accountMap.zhihu.userName}
              password={accountMap.zhihu.password}
            />
          </TabPane>
          <TabPane tab={PLATFORM_INFO.github.name} key="2">
            <AccountPasswordForm
              handleSubmit={this.handleGitHub}
              handleCancel={this.cancelGitHub}
              userName={accountMap.github.userName}
              password={accountMap.github.password}
            />
          </TabPane>
          <TabPane tab={PLATFORM_INFO.medium.name} key="3">
            <Todo />
          </TabPane>
          <TabPane tab={PLATFORM_INFO.jianshu.name} key="4">
            <Todo />
          </TabPane>
        </Tabs>
      </div>
    )
  }
})
