import React, {PropTypes} from 'react'
import styles from './SyncNotifier.css'

const SYNC_TASK_STATUS_MAP = {
  waiting: '等待中',
  failed: '已失败',
  success: '已成功'
}

/**
 * borrowed from https://codepen.io/simongfxu/pen/MeyGzZ
 */
export default React.createClass({
  propTypes: {
    children: PropTypes.any,
    tasks: PropTypes.array.isRequired
  },

  getInitialState() {
    return {
      minimized: false
    }
  },

  getDefaultProps() {
    return {
      tasks: [
        {
          name: 'medium',
          label: 'Medium',
          status: 'waiting'
        },
        {
          name: 'github',
          label: 'GitHub',
          status: 'failed',
          details: '身份验证失败'
        },
        {
          name: 'zhihu',
          label: '知乎',
          status: 'success'
        }
      ]
    }
  },

  hanldeMinimize() {
    this.setState({
      minimized: !this.state.minimized
    })
  },

  renderList() {
    return this.props.tasks.map(task => {
      let details = null
      let handleClick = null
      if (task.details) {
        handleClick = () => {
          App.alert(`${task.label}同步失败`, task.details)
        }
        details = <a href="javascript:;" className={styles.details}>详情</a>
      }

      return (
        <li
          className={styles.taskItem}
          key={task.name}
          onClick={handleClick}
        >
          <span className={`${styles.label} ${styles[task.status]}`}></span>
          {details}
          <p className={styles.text}>{task.label}【{SYNC_TASK_STATUS_MAP[task.status]}】</p>
        </li>
      )
    })
  },

  render() {
    return (
      <div className={`${styles.container} ${this.state.minimized ? styles.minimized : ''}`}>
        <div className={`${styles.taskWrapper} ${this.state.minimized ? styles.minimized : ''}`}>
          <div className={styles.taskContent}>
            <div
              className={styles.taskContentTitle}
              onClick={this.hanldeMinimize}
              title="点击展开/折叠当前面板"
            >
              <h2>
                作品同步进度
                <small className={styles.taskReport}>
                  <span className={styles.taskRemain}>1</span> / 3
                </small>
              </h2>
            </div>
            {!this.state.minimized && (
              <ul className={styles.taskList}>
                {this.renderList()}
              </ul>
            )}
          </div>
        </div>
      </div>
    )
  }
})
