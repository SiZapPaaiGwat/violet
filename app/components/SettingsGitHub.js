import React, {PropTypes} from 'react'
import LoginStatus from './LoginStatus'
import Form from './Form'
import {detectLoginStatus} from '../../electron/ipc_render'
import * as DataUtils from '../helpers/client_data'
import styles from './Settings.css'

export default React.createClass({
  propTypes: {
    states: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
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
    this.props.actions.statusUpdate({
      platform: 'github',
      value: false
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

        this.props.actions.statusUpdate({
          platform: 'github',
          value: true
        })
      } else {
        App.alert('帐号信息错误', 'error', '身份验证失败')
      }
    }).catch(err => {
      App.alert(err.message, 'error')
    })
  },

  render() {
    let githubExtends = {
      name: 'repo',
      type: 'text',
      label: '仓库名',
      placeholder: '请输入GitHub仓库(repo)名称',
      required: true,
      value: ''
    }
    let account = this.props.states.account.github

    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h2>GitHub</h2>
          {this.props.states.status.github ? (
            <LoginStatus
              username={`${account.username}/${account.repo}`}
              onLogout={this.handleGitHubLogout}
            />
          ) : <Form onSubmit={this.saveGithubAccount} extends={[githubExtends]} />}
        </div>
      </div>
    )
  }
})
