import React from 'react'
import Form from './Form'
import * as CloudUtils from '../helpers/cloud_storage'
import styles from '../helpers/create_login/CreateLogin.css'

export default React.createClass({
  getInitialState() {
    return {
      isLoading: false
    }
  },

  handleSubmit(formData) {
    this.setState({isLoading: true})
    CloudUtils.signup(formData).then(msg => {
      this.setState({isLoading: false})
      App.alert('注册成功', '现在你可以使用云端同步功能了。', 'success')
    }).catch(err => {
      this.setState({isLoading: false})
      App.alert('注册失败', err.message)
    })
  },

  render() {
    let extendFields = [
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: '请输入你的Email地址',
        required: true,
        value: ''
      }, {
        name: 'password',
        type: 'password',
        label: '密码',
        placeholder: '请输入密码',
        required: true,
        value: ''
      }
    ]
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h2>
            注册帐号
            <small style={{marginLeft: '24px'}}>启用云端作品同步功能</small>
          </h2>
          <Form
            extends={extendFields}
            onSubmit={this.handleSubmit}
            isLoading={this.state.isLoading}
          />
        </div>
      </div>
    )
  }
})
