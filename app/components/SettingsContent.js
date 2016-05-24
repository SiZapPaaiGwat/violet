import React from 'react'
import ReactTabs from 'react-tabs'
import * as DataUtils from '../helpers/client_data'
import styles from './SettingsContent.css'

let Tab = ReactTabs.Tab
let Tabs = ReactTabs.Tabs
let TabList = ReactTabs.TabList
let TabPanel = ReactTabs.TabPanel

export let accountMap = DataUtils.getAccountMap()

export default React.createClass({
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
