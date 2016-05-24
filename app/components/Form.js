import React, {PropTypes} from 'react'

export default React.createClass({
  propTypes: {
    handleSubmit: PropTypes.func,
    handleCancel: PropTypes.func,
    userName: PropTypes.string,
    password: PropTypes.string
  },

  handleSubmit(e) {
    e.preventDefault()
    if (this.props.handleSubmit) {
      this.props.handleSubmit(this.refs.userName.value, this.refs.password.value)
    }
  },

  handleCancel() {
    if (this.props.handleCancel) {
      this.props.handleCancel()
      this.refs.userName.value = ''
      this.refs.password.value = ''
    }
  },

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <fieldset>
            <div >
              <label htmlFor="name">帐号</label>
              <input ref="userName" type="text" placeholder="请输入登录帐号" required
                className="md-title ant-input ant-input-lg"
                defaultValue={this.props.userName}
              />
            </div>

            <div>
              <label htmlFor="password">密码</label>
              <input ref="password" type="password" placeholder="请输入密码" required
                className="md-title ant-input ant-input-lg"
                defaultValue={this.props.password}
              />
            </div>

            <div>
              <button type="submit" className="pure-button pure-button-primary">立即保存</button>
              <a
                href="javascript:;"
                style={{marginLeft: '2rem'}} onClick={this.handleCancel}
              >
                移除
              </a>
            </div>
        </fieldset>
      </form>
    )
  }
})
