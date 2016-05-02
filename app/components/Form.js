import React, {PropTypes} from 'react'

export default React.createClass({
  propTypes: {
    handleSubmit: PropTypes.func.required,
    userName: PropTypes.string,
    password: PropTypes.string
  },

  handleSubmit(e) {
    e.preventDefault()
    this.props.handleSubmit(this.refs.userName.value, this.refs.password.value)
  },

  render() {
    return (
      <form className="pure-form pure-form-aligned" onSubmit={this.handleSubmit}>
        <fieldset>
            <div className="pure-control-group">
              <label htmlFor="name">帐号</label>
              <input ref="userName" type="text" placeholder="请输入登录帐号" required
                defaultValue={this.props.userName}
              />
            </div>

            <div className="pure-control-group">
              <label htmlFor="password">密码</label>
              <input ref="password" type="password" placeholder="请输入密码" required
                defaultValue={this.props.password}
              />
            </div>

            <div className="pure-controls">
              <button type="submit" className="pure-button pure-button-primary">立即保存</button>
            </div>
        </fieldset>
      </form>
    )
  }
})
