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
    onLoggedIn: PropTypes.func.isRequired,
    extends: PropTypes.array.isRequired,
    getDisplayUsername: PropTypes.func
  },

  getInitialState() {
    return {
      isLoading: false
    }
  },

  getDefaultProps() {
    return {
      getDisplayUsername(account) {
        return account.username
      }
    }
  },

  handleLogout() {
    let name = this.props.platformName
    DataUtils.removeAccountByPlatform(name)
    this.props.actions.accountUpdate({
      platform: name,
      value: null
    })
  },

  handleSubmit(formData) {
    let name = this.props.platformName
    this.setState({isLoading: true})
    checkIdentity({
      [name]: formData
    }).then((result) => {
      let accountInfo = this.props.onLoggedIn(formData, result[name])
      this.props.actions.accountUpdate({
        platform: name,
        value: accountInfo
      })
      this.setState({isLoading: false})
    }).catch(err => {
      console.log(err)
      App.alert('身份验证失败', err.message)
      this.setState({isLoading: false})
    })
  },

  render() {
    let name = this.props.platformName
    let account = this.props.states.account[name]
    let username = account && this.props.getDisplayUsername(account)
    let el = account ? <LoginStatus username={username} onLogout={this.handleLogout} /> :
      <Form onSubmit={this.handleSubmit}
        extends={this.props.extends}
        isLoading={this.state.isLoading}
      />
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h2>{this.props.platformLabel}</h2>
          {el}
        </div>
      </div>
    )
  }
})
