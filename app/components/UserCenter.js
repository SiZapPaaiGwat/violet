import React, {PropTypes} from 'react'
import Form from './Form'
import CloudUtils from '../helpers/cloud_storage'

export default React.createClass({
  propTypes: {
    username: PropTypes.string.isRequired,
    onLogout: PropTypes.func
  },

  getInitialState() {
    return {
      isLoading: false
    }
  },

  handleSubmit(formData) {
    this.setState({isLoading: true})
    CloudUtils.query().then(cloudPosts => {
      this.setState({isLoading: true})
      return CloudUtils.syncNow(cloudPosts, this.props.states.posts.datasource)
    }).then(() => {
      this.setState({isLoading: true})
      App.alert('同步成功', '本次同步云端新增2条记录，更新3条记录<br /> 本地删除1条记录，更新2条记录', 'success')
    }).catch(err => {
      App.alert('同步出错', err.message)
    })
  },

  render() {
    let extendFields = [
      {
        name: 'email',
        type: 'email',
        label: '帐号',
        placeholder: '请输入你的Email地址',
        required: true,
        value: ''
      }
    ]
    return (
      <div>
        <div>
          <h2>注册同步帐号</h2>
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
