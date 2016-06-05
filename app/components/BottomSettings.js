import React, {PropTypes} from 'react'
import * as DbUtils from '../helpers/database'
import {DEFAULT_TITLE, DEFAULT_CONTENT} from '../helpers/const'
import styles from './BottomSettings.css'
import globalStyles from '../css/global.css'
import zhihuIcon from '../imgs/zhihu.ico'
import githubIcon from '../imgs/github.ico'

export default React.createClass({
  propTypes: {
    actions: PropTypes.object.isRequired,
    states: PropTypes.object.isRequired,
    parent: PropTypes.object.isRequired
  },

  handleCreate() {
    let items = this.props.states.posts.datasource
    let newestItem = items[0] || {}
    if (newestItem.title === DEFAULT_TITLE && newestItem.content === DEFAULT_CONTENT) {
      this.props.actions.postsSelect(newestItem)
      return
    }

    DbUtils.createPost(DEFAULT_TITLE, DEFAULT_CONTENT).then(id => {
      this.props.actions.postsCreate({
        id,
        title: DEFAULT_TITLE,
        content: DEFAULT_CONTENT,
        create_on: Date.now(),
        platforms: []
      })
      this.props.actions.postsSelect(this.props.states.posts.datasource[0])
    }).catch(err => {
      App.alert(err.message, 'error', '新建作品失败')
    })
  },

  handleSync() {
    this.props.parent.handleSync()
  },

  showZhihu() {
    this.props.actions.settingsShow({name: 'zhihu'})
  },

  showGitHub() {
    this.props.actions.settingsShow({name: 'github'})
  },

  render() {
    let status = this.props.states.status
    let account = this.props.states.account
    return (
      <div className={styles.bottomSettingsContainer}>
        <div style={{cssFloat: 'left'}}>
          <a
            href="javascript:;"
            onClick={this.showZhihu}
            title={!status.zhihu ? '设置知乎帐号' : account.zhihu.username}
            className={status.zhihu ? '' : styles.disabled}
            disabled={!status.zhihu}
            style={{visibility: status.zhihu !== null ? 'visible' : 'hidden'}}
          >
            <img src={zhihuIcon} alt="zhihu" className={styles.img} />
          </a>
          <a
            href="javascript:;"
            onClick={this.showGitHub}
            title={!status.github ? '设置GitHub帐号' : account.github.username}
            className={status.github ? '' : styles.disabled}
            style={{visibility: status.zhihu !== null ? 'visible' : 'hidden'}}
          >
            <img src={githubIcon} alt="zhihu" className={styles.img} />
          </a>
        </div>

        <div style={{cssFloat: 'right'}}>
          <a
            onClick={this.handleCreate}
            className={status.create ? '' : styles.clickableless}
            href="javascript:;"
            title="创作新的作品"
          >
            <i className={globalStyles.iconfont}>&#xe677;</i>
          </a>
          <a
            onClick={this.handleSync}
            className={status.sync ? '' : styles.clickableless}
            href="javascript:;"
            title="同步当前作品"
          >
            <i className={globalStyles.iconfont}>&#xe6a2;</i>
          </a>
        </div>
      </div>
    )
  }
})
