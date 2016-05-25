import React, {PropTypes} from 'react'

export default React.createClass({
  propTypes: {
    username: PropTypes.string.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handlerLogout: PropTypes.func.isRequired
  },

  render() {
    return (
      <div>
        <div>
          <strong>状态:</strong> <span>已登录</span>
        </div>
        <div>
          <strong>用户名:</strong> <span>${this.props.username}</span>
        </div>
        <div style={{textAlign: 'center'}}>
          <button onClick={this.props.handleEdit}>开始编辑</button> |
          <button onClick={this.props.handlerLogout}>注销</button>
        </div>
      </div>
    )
  }
})
