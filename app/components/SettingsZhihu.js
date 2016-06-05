import React, {PropTypes} from 'react'
import LoginStatus from './LoginStatus'
import {parseWebviewCookiesByDomain, whoAmI} from '../../electron/ipc_render'
import * as DataUtils from '../helpers/client_data'
import {getCookieByName} from '../helpers/utils'
import {
  ZHIHU_XSRF_TOKEN_NAME, ZHUANLAN_URL, LOGIN_URL, LOGOUT_URL, ZHIHU_DOMAIN
} from '../helpers/const'
import styles from './Settings.css'

export default React.createClass({
  propTypes: {
    states: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      isLoggingOut: null
    }
  },

  componentDidUpdate(nextProps, nextState) {
    let isLogin = this.props.states.status.zhihu
    let isLoggingOut = this.state.isLoggingOut
    // 注销时绑定事件
    if (!isLogin && isLoggingOut === false) {
      this.onWebviewMounted()
    }
  },

  componentDidMount() {
    this.onWebviewMounted()
  },

  onWebviewMounted() {
    let webview = this.refs.webview
    if (!webview) {
      console.warn('webview is not mounted.')
      return
    }

    webview.addEventListener('did-navigate', (e) => {
      if (e.url === ZHUANLAN_URL) {
        let session = webview.getWebContents().session
        // 这里需要获取所有zhihu域名下的cookie
        parseWebviewCookiesByDomain(session, ZHIHU_DOMAIN)
        .then(function(cookie) {
          DataUtils.setCookiesByPlatform('zhihu', cookie)
          return whoAmI({
            cookie,
            token: getCookieByName(cookie, ZHIHU_XSRF_TOKEN_NAME)
          })
        }).then(json => {
          this.props.actions.accountUpdate({
            platform: 'zhihu',
            value: {
              username: json.email,
              password: ''
            }
          })
          DataUtils.updateAccount('zhihu', json.email, '')
          this.props.actions.statusUpdate({
            platform: 'zhihu',
            value: true
          })
        }).catch(err => {
          App.alert(err.message)
        })
      }
    })
  },

  handleZhihuLogout() {
    DataUtils.setCookiesByPlatform('zhihu', null)
    this.setState({
      isLoggingOut: true
    }, () => {
      let webview = this.refs.webview
      webview.addEventListener('did-get-response-details', (e) => {
        this.props.actions.statusUpdate({
          platform: 'zhihu',
          value: false
        })
        this.setState({
          isLoggingOut: false
        })
      })
    })
  },

  renderZhihu() {
    let accountMap = this.props.states.account
    let status = this.props.states.status
    if (status.zhihu) {
      return (
        <div className={styles.formContainer}>
          <h2>知乎</h2>
          <LoginStatus
            username={accountMap.zhihu.username}
            onLogout={this.handleZhihuLogout}
          />
          {
            this.state.isLoggingOut && (
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
      <webview
        className={styles.normal}
        ref="webview"
        src={LOGIN_URL}
        disablewebsecurity
        partition="persist:zhihu"
      />
    )
  },

  render() {
    return (
      <div className={styles.container}>
        {this.renderZhihu()}
      </div>
    )
  }
})
