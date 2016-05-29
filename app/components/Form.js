import React, {PropTypes} from 'react'

export default React.createClass({
  propTypes: {
    onSubmit: PropTypes.func,
    username: PropTypes.string,
    password: PropTypes.string
  },

  handleSubmit(e) {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.refs.username.value, this.refs.password.value)
    }
  },

  render() {
    return (
      <fieldset>
        <div >
          <label htmlFor="name">帐号</label>
          <input ref="username" type="text" placeholder="请输入登录帐号" required
            defaultValue={this.props.username}
          />
        </div>

        <div>
          <label htmlFor="password">密码</label>
          <input ref="password" type="password" placeholder="请输入密码" required
            defaultValue={this.props.password}
          />
        </div>

        <div>
          <button
            onClick={this.handleSubmit}
            type="button"
          >立即保存</button>
        </div>
      </fieldset>
    )
  }
})
