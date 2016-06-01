import React, {PropTypes} from 'react'
import Modal from 'react-skylight'
import LoginStatus from './LoginStatus'
import {parseWebviewCookiesByDomain, whoAmI} from '../../electron/ipc_render'
import * as DataUtils from '../helpers/client_data'
import {getCookieByName} from '../helpers/utils'
import {ZHIHU_XSRF_TOKEN_NAME} from '../helpers/const'
import styles from './Settings.css'

const HOME_PAGE_URL = 'https://www.zhihu.com/'
const LOGIN_URL = 'https://www.zhihu.com/signin'
const LOGOUT_URL = 'https://www.zhihu.com/logout'

export default React.createClass({
  propTypes: {
    states: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      isLoggedIn: null,
      isLoggedOut: false
    }
  },

  componentDidMount() {
    DataUtils.getLoginDetails({zhihu: true}).then(result => {
      this.setState({
        isLoggedIn: !!result
      })
      this.refs.dialog.show()
      this.onWebviewMounted()
    }).catch(err => {
      App.alert(err)
    })
  },

  onWebviewMounted() {
    let webview = this.refs.webview
    if (!webview) {
      console.warn('webview is not mounted.')
      return
    }

    webview.addEventListener('will-navigate', (e) => {
      if (e.url === LOGIN_URL || e.url === HOME_PAGE_URL) {
        let session = webview.getWebContents().session
        parseWebviewCookiesByDomain(session, 'zhihu.com').then(function(cookie) {
          DataUtils.setCookiesByPlatform('zhihu', cookie)
          return whoAmI({cookie, token: getCookieByName(cookie, ZHIHU_XSRF_TOKEN_NAME)})
        }).then(json => {
          this.props.actions.accountUpdate({
            platform: 'zhihu',
            value: {
              username: json.email,
              password: ''
            }
          })
          DataUtils.updateAccount('zhihu', json.email, '')
          this.setState({
            isLoggedIn: true
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
      isLoggedOut: true
    }, () => {
      let webview = this.refs.webview
      webview.addEventListener('did-get-response-details', (e) => {
        this.setState({
          isLoggedIn: false,
          isLoggedOut: false,
        }, () => {
          this.onWebviewMounted()
        })
      })
    })
  },

  resetSettings() {
    this.props.actions.settingsShow({name: ''})
  },

  renderZhihu() {
    let accountMap = this.props.states.account
    if (this.state.isLoggedIn) {
      return (
        <div>
          <LoginStatus
            username={accountMap.zhihu.username}
            onLogout={this.handleZhihuLogout}
          />
          {
            this.state.isLoggedOut && (
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

  render() {
    // TODO compute from css
    let dialogStyles = {
      width: '400px',
      height: '480px',
      marginTop: '-240px',
      marginLeft: '-200px'
    }

    return (
      <Modal ref="dialog" title="知乎"
        dialogStyles={dialogStyles}
        afterClose={this.resetSettings}
      >
        {this.renderZhihu()}
      </Modal>
    )
  }
})
