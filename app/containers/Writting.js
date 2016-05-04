import React from 'react'
import {Alert} from 'antd'
import {SYNC_PLATFORMS, PLATFORM_INFO, MOBILE_UA} from '../helpers/const'
import {accountMap} from './Settings'
import {syncArticle, parseWebviewCookiesByDomain} from '../helpers/electron_render'
import {getCookieByName} from '../helpers/utils'

function getSyncPlatforms() {
  let syncNum = 0
  let result = SYNC_PLATFORMS.map((platform) => {
    let content
    if (accountMap[platform].userName && accountMap[platform].password) {
      syncNum += 1
      content = <img key={platform} src={PLATFORM_INFO[platform].icon} alt={platform} />
    }
    return content
  })

  return syncNum && result
}

export default React.createClass({
  getInitialState() {
    return {
      showWebview: false,
      loading: true
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.state.showWebview && this.state.loading) {
      let webview = this.refs.webview
      webview.addEventListener('dom-ready', () => {
        this.setState({
          loading: false
        })

        let session = webview.getWebContents().session
        parseWebviewCookiesByDomain(session, 'zhihu.com').then(function(cookie) {
          let token = getCookieByName(cookie, 'XSRF-TOKEN')
          return syncArticle({cookie, token})
        }).then(function(result) {
          console.log(result)
        })
      })
    }
  },

  handleSubmit() {
    this.setState({
      showWebview: true
    })
  },

  renderWrittingPage() {
    let syncTip = getSyncPlatforms()
    if (syncTip) {
      syncTip = (
        <div>
          <button
            type="button"
            className="pure-button pure-button-primary"
            onClick={this.handleSubmit}
          >
            立即同步
          </button>
          <div className="sync-list">
            <em>将同步到以下平台:</em>
            <br />
            {syncTip}
          </div>
        </div>
      )
    } else {
      syncTip = (
        <div>
          <button
            type="button"
            disabled
            className="pure-button pure-button-primary"
          >
            立即同步
          </button>
          <div className="sync-list">
            你还没有进行同步设置，<a href="#/settings">前往设置</a>
          </div>
        </div>
      )
    }

    return (
      <div>
        <Alert
          message="开始创作"
          description="使用Markdown格式写作，一键同步发布到多个平台"
          type="info"
        />

        <input
          className="md-title ant-input ant-input-lg"
          type="text"
          ref="title"
          placeholder="请输入文章标题"
        />
        <textarea
          ref="content"
          className="md-zone ant-input ant-input-lg"
          placeholder="请输入文章内容，直接将Markdown内容粘贴到此处"
        />

        {syncTip}
      </div>
    )
  },

  renderWebview() {
    return (
      <div>
        {this.state.loading && <div style={{textAlign: 'center'}}>loading...</div>}
        <webview
          ref="webview"
          src="https://zhuanlan.zhihu.com/write"
          useragent={MOBILE_UA}
          disablewebsecurity
          partition="persist:zhihu"
        />
      </div>
    )
  },

  render() {
    return (
      <div className="container-padding" style={{position: 'relative'}}>
        {this.state.showWebview ? this.renderWebview() : this.renderWrittingPage()}
      </div>
    )
  }
})
