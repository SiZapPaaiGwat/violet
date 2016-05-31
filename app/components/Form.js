import React, {PropTypes} from 'react'

export default React.createClass({
  propTypes: {
    onSubmit: PropTypes.func,
    username: PropTypes.string,
    password: PropTypes.string,
    extends: PropTypes.array
  },

  handleSubmit(e) {
    if (this.props.onSubmit) {
      let extendFields = this.props.extends ?
        this.props.extends.map(item => this.refs[item.name].value) : []
      this.props.onSubmit(this.refs.username.value, this.refs.password.value, ...extendFields)
    }
  },

  render() {
    let extra = this.props.extends ? this.props.extends.map(item => {
      let type = item.type || 'text'
      return (
        <div key={item.name}>
          <div>
            <label htmlFor={item.name}>{item.label}</label>
            <input
              ref={item.name}
              type={type}
              placeholder={item.placeholder}
              required={item.required}
              defaultValue={item.value}
            />
          </div>
        </div>
      )
    }) : null

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

        {extra}

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
