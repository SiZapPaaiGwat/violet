import React, {PropTypes} from 'react'
import LoginStatus from '../../components/LoginStatus'
import Form from '../../components/Form'
import {detectLoginStatus} from '../../../electron/ipc_render'
import * as DataUtils from '../client_data'
import styles from './Settings.css'

export default React.createClass({
  propTypes: {
    states: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    platformName: PropTypes.string.isRequired,
    platformLabel: PropTypes.string.isRequired,
    updateAccount: PropTypes.func.isRequired,
    extends: PropTypes.array.isRequired,
    transfromUsername: PropTypes.func.isRequired
  },

  handleLogout() {
    let name = this.props.platformName
    DataUtils.removeAccountByPlatform(name)
    this.props.actions.accountUpdate({
      platform: name,
      value: {}
    })
    this.props.actions.statusUpdate({
      platform: name,
      value: false
    })
  },

  saveAccount(formData) {
    let name = this.props.platformName
    detectLoginStatus({
      [name]: formData
    }).then((result) => {
      if (result[name]) {
        this.props.actions.accountUpdate({
          platform: name,
          value: formData
        })
        this.props.actions.statusUpdate({
          platform: name,
          value: true
        })
        this.props.updateAccount(name, formData)
      } else {
        App.alert('请重新检查表单', 'error', '身份验证失败')
      }
    }).catch(err => {
      console.log(err)
      App.alert(err.message, 'error')
    })
  },

  render() {
    let name = this.props.platformName
    let account = this.props.states.account[name]
    let username = this.props.transfromUsername(account)

    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h2>{this.props.platformLabel}</h2>
          {this.props.states.status[name] ? (
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
