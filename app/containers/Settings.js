import React, {Component} from 'react'
import {Tabs, Alert} from 'antd'
import AccountPasswordForm from '../components/Form'
import Todo from '../components/Todo'

const TabPane = Tabs.TabPane

export default class Settings extends Component {
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
            <AccountPasswordForm />
          </TabPane>
          <TabPane tab="GitHub" key="2">
            <AccountPasswordForm />
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
}
