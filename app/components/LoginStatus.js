import React, {PropTypes} from 'react'

export default React.createClass({
  propTypes: {
    username: PropTypes.string.isRequired,
    onEdit: PropTypes.func,
    onLogout: PropTypes.func
  },

  render() {
    return (
      <div>
        <div>
          <strong>状态:</strong> <span>已登录</span>
        </div>
        <div>
          <strong>用户名:</strong> <span>{this.props.username}</span>
        </div>
        <div style={{textAlign: 'center'}}>
          <button onClick={this.props.onEdit}>开始编辑</button> |
          <button onClick={this.props.onLogout}>注销</button>
        </div>
      </div>
    )
  }
})
