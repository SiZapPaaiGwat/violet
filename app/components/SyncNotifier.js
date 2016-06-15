import React, {PropTypes} from 'react'
import styles from './SyncNotifier.css'
import globalStyles from '../css/var.css'

const SYNC_TASK_STATUS_MAP = {
  waiting: '同步中',
  failed: '已失败',
  success: '已成功'
}

/**
 * borrowed from https://codepen.io/simongfxu/pen/MeyGzZ
 */
export default React.createClass({
  propTypes: {
    children: PropTypes.any,
    actions: PropTypes.object.isRequired,
    tasks: PropTypes.array.isRequired
  },

  getInitialState() {
    return {
      minimized: false
    }
  },

  hanldeMinimize() {
    this.setState({
      minimized: !this.state.minimized
    })
  },

  handleClose(e) {
    e.stopPropagation()
    this.props.actions.notifierSet([])
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
    let tasks = this.props.tasks
    let finished = tasks.filter(task => {
      return task.status === 'success'
    })
    let isJobDone = !tasks.some(task => {
      return task.status === 'waiting'
    })
    let closeBtn = isJobDone && (
      <a href="javascript:;" className={styles.close} onClick={this.handleClose}>关闭</a>
    )
    let height = parseInt(globalStyles.notifierHeadHeight, 10)
    if (!this.state.minimized) {
      height += tasks.length * 35
    }

    return (
      <div
        className={`${styles.container} ${this.state.minimized ? styles.minimized : ''}`}
        style={{height: `${height}px`}}
      >
        <div className={`${styles.taskWrapper} ${this.state.minimized ? styles.minimized : ''}`}>
          <div className={styles.taskContent}>
            <div
              className={styles.taskContentTitle}
              onClick={this.hanldeMinimize}
              title="点击展开/折叠当前面板"
            >
              {closeBtn}

              <h2>
                作品同步进度
                <small className={styles.taskReport}>
                  <span className={styles.taskRemain}>{finished.length}</span> / {tasks.length}
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
