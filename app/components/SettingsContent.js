import React from 'react'
import ReactTabs from 'react-tabs'
import Loading from './Loading'
import LoginStatus from './LoginStatus'
import Form from './Form'
import {detectLoginStatus, parseWebviewCookiesByDomain, whoAmI} from '../../electron/ipc_render'
import * as DataUtils from '../helpers/client_data'
import {getCookieByName} from '../helpers/utils'
import styles from './SettingsContent.css'

let Tab = ReactTabs.Tab
let Tabs = ReactTabs.Tabs
let TabList = ReactTabs.TabList
let TabPanel = ReactTabs.TabPanel
const HOME_PAGE_URL = 'https://www.zhihu.com/'
const LOGIN_URL = 'https://www.zhihu.com/signin'
const LOGOUT_URL = 'https://www.zhihu.com/logout'

export let accountMap = DataUtils.getAccountMap()

export default React.createClass({
  getInitialState() {
    return {
      github: null,
      zhihu: null,
      logoutZhihu: false
    }
  },

  componentDidMount() {
    DataUtils.getLoginDetails(accountMap).then(result => {
      this.setState(result)
    }).catch(err => {
      console.log(err)
    })

    this.onWebviewMounted()
  },

  handleSelect(i, last) {
    if (i === 0) {
      setTimeout(() => {
        this.onWebviewMounted()
      }, 0)
    }
  },

  onWebviewMounted() {
    if (this.state.zhihu) return

    let webview = this.refs.webview
    webview.addEventListener('will-navigate', (e) => {
      if (e.url === LOGIN_URL || e.url === HOME_PAGE_URL) {
        let session = webview.getWebContents().session
        parseWebviewCookiesByDomain(session, 'zhihu.com').then(function(cookie) {
          DataUtils.setCookiesByPlatform('zhihu', cookie)
          return whoAmI({cookie, token: getCookieByName(cookie, 'XSRF-TOKEN')})
        }).then(json => {
          accountMap.zhihu.username = json.email
          DataUtils.updateAccount('zhihu', json.email, Date.now().toString(16))
          this.setState({
            zhihu: true
          })
        }).catch(err => {
          alert(err.message)
        })
      }
    })
  },

  handleZhihuLogout() {
    DataUtils.setCookiesByPlatform('zhihu', null)
    this.setState({
      logoutZhihu: true
    }, () => {
      let webview = this.refs.webview
      webview.addEventListener('did-get-response-details', (e) => {
        this.setState({
          zhihu: false,
          logoutZhihu: false,
        }, () => {
          this.onWebviewMounted()
        })
      })
    })
  },

  renderZhihu() {
    if (this.state.zhihu) {
      return (
        <div>
          <LoginStatus
            username={accountMap.zhihu.username}
            onLogout={this.handleZhihuLogout}
          />
          {
            this.state.logoutZhihu && (
              <webview
                className={styles.hide}
                ref="webview"
                src={LOGOUT_URL}
                disablewebsecurity
                partition="persist:zhihu"
              />
            )
          }
        </div>
      )
    }

    return (
      <div>
        <webview
          className={styles.normal}
          ref="webview"
          src={LOGIN_URL}
          disablewebsecurity
          partition="persist:zhihu"
        />
      </div>
    )
  },

  handleGitHubLogout() {
    DataUtils.removeAccountByPlatform('github')
    accountMap.github.username = ''
    accountMap.github.password = ''
    this.setState({
      github: false
    })
  },

  saveGithubAccount(username, password) {
    detectLoginStatus({
      github: {username, password}
    }).then(isLogin => {
      if (isLogin) {
        DataUtils.updateAccount('github', username, password)
        accountMap.github.username = username
        accountMap.github.password = password
        this.setState({
          github: true
        })
      } else {
        alert('验证失败')
      }
    }).catch(err => {
      alert(err.message)
    })
  },

  render() {
    return (
      <div className={styles.contentContainer} style={{display: 'block'}}>
        <Tabs onSelect={this.handleSelect}>
          <TabList>
            <Tab>知乎</Tab>
            <Tab>GitHub</Tab>
          </TabList>

          <TabPanel>
            <Loading status={this.state.zhihu}>
              {this.renderZhihu()}
            </Loading>
          </TabPanel>

          <TabPanel>
            <Loading status={this.state.github}>
              {this.state.github ? (
                <LoginStatus
                  username={accountMap.github.username}
                  onLogout={this.handleGitHubLogout}
                />
            ) : <Form onSubmit={this.saveGithubAccount} />}
            </Loading>
          </TabPanel>
        </Tabs>
      </div>
    )
  }
})
