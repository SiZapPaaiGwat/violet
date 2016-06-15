import React, {PropTypes} from 'react'
import LoginStatus from '../../components/LoginStatus'
import Form from '../../components/Form'
import {checkIdentity} from '../../../electron/ipc_render'
import * as DataUtils from '../client_data'
import styles from './CreateLogin.css'

export default React.createClass({
  propTypes: {
    states: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    platformName: PropTypes.string.isRequired,
    platformLabel: PropTypes.string.isRequired,
    updateAccount: PropTypes.func.isRequired,
    extends: PropTypes.array.isRequired,
    getUsername: PropTypes.func.isRequired
  },

  handleLogout() {
    let name = this.props.platformName
    DataUtils.removeAccountByPlatform(name)
    this.props.actions.accountUpdate({
      platform: name,
      value: null
    })
  },

  saveAccount(formData) {
    let name = this.props.platformName
    checkIdentity({
      [name]: formData
    }).then((result) => {
      if (result[name]) {
        // 哪些信息需要返回存储到本地由实现者决定
        // 客户端数据以及服务端数据一并返回给实现者
        let accountInfo = this.props.updateAccount(name, formData, result[name])
        this.props.actions.accountUpdate({
          platform: name,
          value: accountInfo
        })
      } else {
        App.alert('身份验证失败', '请重新检查表单')
      }
    }).catch(err => {
      console.log(err)
      App.alert('身份验证失败', err.message)
    })
  },

  render() {
    let name = this.props.platformName
    let account = this.props.states.account[name]
    let username = account && this.props.getUsername(account)

    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h2>{this.props.platformLabel}</h2>
          {account ? (
            <LoginStatus
              username={username}
              onLogout={this.handleLogout}
            />
          ) : <Form onSubmit={this.saveAccount} extends={this.props.extends} />}
        </div>
      </div>
    )
  }
})
