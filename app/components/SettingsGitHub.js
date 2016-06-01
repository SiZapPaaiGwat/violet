import React, {PropTypes} from 'react'
import Modal from 'react-skylight'
import Loading from './Loading'
import LoginStatus from './LoginStatus'
import Form from './Form'
import {detectLoginStatus} from '../../electron/ipc_render'
import * as DataUtils from '../helpers/client_data'

export default React.createClass({
  propTypes: {
    states: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  },

  getInitialState() {
    // TODO state 全部放到redux
    return {
      isLoggedIn: null
    }
  },

  componentDidMount() {
    let github = this.props.states.account.github
    DataUtils.getLoginDetails({github}).then(result => {
      this.setState({
        isLoggedIn: result
      })
      this.refs.dialog.show()
    }).catch(err => {
      App.alert(err.message)
    })
  },

  resetSettings() {
    this.props.actions.settingsShow({name: ''})
  },

  handleGitHubLogout() {
    DataUtils.removeAccountByPlatform('github')
    this.props.actions.accountUpdate({
      platform: 'github',
      value: {
        username: '',
        password: ''
      }
    })
    this.setState({
      isLoggedIn: false
    })
  },

  saveGithubAccount(username, password, repo) {
    if (!username || !password || !repo) {
      App.alert('输入的帐号信息不完整')
      return
    }

    detectLoginStatus({
      github: {username, password}
    }).then(isLogin => {
      if (isLogin) {
        DataUtils.updateAccount('github', username, password, repo)
        this.props.actions.accountUpdate({
          platform: 'github',
          value: {
            username,
            password,
            repo
          }
        })

        this.setState({
          isLoggedIn: true
        })
      } else {
        App.alert('验证失败', 'error')
      }
    }).catch(err => {
      App.alert(err.message, 'error')
    })
  },

  render() {
    let dialogStyles = {
      width: '400px',
      height: '480px',
      marginTop: '-240px',
      marginLeft: '-200px'
    }
    let githubExtends = {
      name: 'repo',
      type: 'text',
      label: '仓库名',
      placeholder: '请输入GitHub仓库(repo)名称',
      required: true,
      value: ''
    }
    let accountMap = this.props.states.account

    return (
      <Modal ref="dialog" title="GitHub"
        dialogStyles={dialogStyles}
        afterClose={this.resetSettings}
      >
        <Loading status={this.state.isLoggedIn}>
          {this.state.isLoggedIn ? (
            <LoginStatus
              username={accountMap.github.username}
              onLogout={this.handleGitHubLogout}
            />
        ) : <Form onSubmit={this.saveGithubAccount} extends={[githubExtends]} />}
        </Loading>
      </Modal>
    )
  }
})
