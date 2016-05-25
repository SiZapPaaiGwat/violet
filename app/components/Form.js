import React, {PropTypes} from 'react'

export default React.createClass({
  propTypes: {
    handleSubmit: PropTypes.func,
    handleCancel: PropTypes.func,
    username: PropTypes.string,
    password: PropTypes.string
  },

  handleSubmit(e) {
    e.preventDefault()
    if (this.props.handleSubmit) {
      this.props.handleSubmit(this.refs.username.value, this.refs.password.value)
    }
  },

  handleCancel() {
    if (this.props.handleCancel) {
      this.props.handleCancel()
      this.refs.username.value = ''
      this.refs.password.value = ''
    }
  },

  render() {
    let removeLink = this.props.username ? (
      <a href="javascript:;"
        style={{marginLeft: '2rem'}} onClick={this.handleCancel}
      >
        移除
      </a>
    ) : null

    return (
      <form onSubmit={this.handleSubmit}>
        <fieldset>
            <div >
              <label htmlFor="name">帐号</label>
              <input ref="username" type="text" placeholder="请输入登录帐号" required
                className="md-title ant-input ant-input-lg"
                defaultValue={this.props.username}
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
              {removeLink}
            </div>
        </fieldset>
      </form>
    )
  }
})
