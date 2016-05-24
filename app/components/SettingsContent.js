import React from 'react'
import ReactTabs from 'react-tabs'
import {detectLoginStatus} from '../../electron/ipc_render'
import * as DataUtils from '../helpers/client_data'
import styles from './SettingsContent.css'

let Tab = ReactTabs.Tab
let Tabs = ReactTabs.Tabs
let TabList = ReactTabs.TabList
let TabPanel = ReactTabs.TabPanel

export let accountMap = DataUtils.getAccountMap()

export default React.createClass({
  componentDidMount() {
    detectLoginStatus({
      zhihu: {
        cookie: localStorage.getItem('zhihu_cookie')
      },
      github: {
        username: accountMap.github.username,
        password: accountMap.github.password
      }
    }).then(result => {
      console.log(result)
    }).catch(err => {
      console.log(err)
    })
  },

  render() {
    return (
      <div className={styles.contentContainer} style={{display: 'block'}}>
        <Tabs>
          <TabList>
            <Tab>知乎</Tab>
            <Tab>GitHub</Tab>
          </TabList>

          <TabPanel>
            hello world1!
          </TabPanel>
          <TabPanel>
            hello world2!
          </TabPanel>
        </Tabs>
      </div>
    )
  }
})
