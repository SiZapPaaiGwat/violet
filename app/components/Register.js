import React, {PropTypes} from 'react'
import Form from './Form'
import * as CloudUtils from '../helpers/cloud_storage'
import styles from '../helpers/create_login/CreateLogin.css'

export default React.createClass({
  propTypes: {
    actions: PropTypes.object.isRequired,
    states: PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      isLoading: false
    }
  },

  handleSubmit(formData) {
    if (formData.password.length < 6) {
      App.alert('密码填写有误', '密码不能少于6位长度')
      return
    }

    this.setState({isLoading: true})
    CloudUtils.signin(formData).then(msg => {
      this.props.actions.settingsShow({name: 'user_center'})
    }).catch(e => {
      if (e.code === 211) {
        return CloudUtils.signup(formData).then(msg => {
          this.props.actions.settingsShow({name: 'user_center'})
          App.alert('注册成功', '现在你可以使用云端同步功能了。', 'success')
        }).catch(err => {
          this.setState({isLoading: false})
          App.alert('注册失败', err.message)
        })
      }

      this.setState({isLoading: false})
      return App.alert('登录失败', '帐号或密码错误')
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
        placeholder: '请输入密码，长度不能少于 6 位',
        required: true,
        value: ''
      }
    ]
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h2>
            注册或登录
            <small style={{marginLeft: '24px'}}>将本地作品保存到云端</small>
          </h2>
          <Form
            btnText="提交"
            extends={extendFields}
            onSubmit={this.handleSubmit}
            isLoading={this.state.isLoading}
          />
        </div>
      </div>
    )
  }
})
