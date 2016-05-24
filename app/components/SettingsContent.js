import React from 'react'
import ReactTabs from 'react-tabs'
import Loading from './Loading'
import {detectLoginStatus} from '../../electron/ipc_render'
import * as DataUtils from '../helpers/client_data'
import styles from './SettingsContent.css'

let Tab = ReactTabs.Tab
let Tabs = ReactTabs.Tabs
let TabList = ReactTabs.TabList
let TabPanel = ReactTabs.TabPanel

export let accountMap = DataUtils.getAccountMap()

export default React.createClass({
  getInitialState() {
    return {
      github: null,
      zhihu: null
    }
  },

  componentDidMount() {
    detectLoginStatus({
      zhihu: {
        cookie: DataUtils.getCookiesByPlatform('zhihu')
      },
      github: {
        username: accountMap.github.username,
        password: accountMap.github.password
      }
    }).then(result => {
      this.setState(result)
    }).catch(err => {
      console.log(err)
    })
  },

  render() {
    // TODO 已登录展示帐号信息,可以退出;未登录则提供输入(知乎使用webview,github使用输入框)
    return (
      <div className={styles.contentContainer} style={{display: 'block'}}>
        <Tabs>
          <TabList>
            <Tab>知乎</Tab>
            <Tab>GitHub</Tab>
          </TabList>

          <TabPanel>
            <Loading status={this.state.zhihu}>
              Hello world 1!
            </Loading>
          </TabPanel>
          <TabPanel>
            <Loading status={this.state.github}>
              Hello world 2!
            </Loading>
          </TabPanel>
        </Tabs>
      </div>
    )
  }
})
