import React from 'react'
import {Tabs, Alert} from 'antd'
import {encrypt, decrypt} from '../helpers/aes'
import AccountPasswordForm from '../components/Form'
import Todo from '../components/Todo'

const TabPane = Tabs.TabPane
const ACCOUNT_MAP = {}
const SPLIT_FLAG = '\n'

// 获取帐号配置信息
'zhihu,github,medium,jianshu'.split(',').forEach((platform) => {
  let pair = localStorage.getItem(platform) || ''
  pair = pair && decrypt(pair).split(SPLIT_FLAG)
  ACCOUNT_MAP[platform] = {
    userName: pair && pair[0],
    password: pair && pair[1]
  }
})

function savePlatformAccount(platform, userName, password) {
  if (!userName || !password) {
    return
  }

  localStorage.setItem(platform, encrypt(`${userName}${SPLIT_FLAG}${password}`))
}

export default React.createClass({
  handleZhihu(userName, password) {
    savePlatformAccount('zhihu', userName, password)
  },

  handleGitHub(userName, password) {
    savePlatformAccount('github', userName, password)
  },

  render() {
    return (
      <div style={{padding: '1rem'}}>
        <Alert
          message="同步设置"
          description="同步的各个平台帐号和密码使用加密技术存储在本地，无需担心密码泄露"
          type="info"
        />

        <Tabs defaultActiveKey="1">
          <TabPane tab="知乎" key="1">
            <AccountPasswordForm
              handleSubmit={this.handleZhihu}
              userName={ACCOUNT_MAP.zhihu.userName}
              password={ACCOUNT_MAP.zhihu.password}
            />
          </TabPane>
          <TabPane tab="GitHub" key="2">
            <AccountPasswordForm
              handleSubmit={this.handleGitHub}
              userName={ACCOUNT_MAP.github.userName}
              password={ACCOUNT_MAP.github.password}
            />
          </TabPane>
          <TabPane tab="Medium" key="3">
            <Todo />
          </TabPane>
          <TabPane tab="简书" key="4">
            <Todo />
          </TabPane>
        </Tabs>
      </div>
    )
  }
})
