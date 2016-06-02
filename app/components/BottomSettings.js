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
    states: PropTypes.object.isRequired
  },

  showContentPage() {
    this.props.actions.settingsShow()
  },

  handleCreate() {
    DbUtils.createPost(DEFAULT_TITLE, DEFAULT_CONTENT).then(id => {
      this.props.actions.postsCreate({
        id,
        title: DEFAULT_TITLE,
        content: DEFAULT_CONTENT,
        create_on: Date.now(),
        platforms: []
      })
      let items = this.props.states.posts.datasource
      this.props.actions.postsSelect(items[0])
    }).catch(err => {
      App.alert('新建作品失败')
    })
  },

  showZhihu() {
    this.props.actions.settingsShow({name: 'zhihu'})
  },

  showGitHub() {
    this.props.actions.settingsShow({name: 'github'})
  },

  showList() {
    this.props.actions.settingsShow({name: 'list'})
  },

  render() {
    let status = this.props.states.status
    let account = this.props.states.account
    return (
      <div className={styles.bottomSettingsContainer}>
        <a
          href="javascript:;"
          onClick={this.showZhihu}
          title={status.zhihu === false ? '设置知乎帐号' : account.zhihu.username}
          className={status.zhihu === false ? styles.disabled : ''}
          style={{visibility: status.zhihu !== null ? 'visible' : 'hidden'}}
        >
          <img src={zhihuIcon} alt="zhihu" className={styles.img} />
        </a>
        <a
          href="javascript:;"
          onClick={this.showGitHub}
          title={status.github === false ? '设置GitHub帐号' : account.github.username}
          className={status.github === false ? styles.disabled : ''}
          style={{visibility: status.zhihu !== null ? 'visible' : 'hidden'}}
        >
          <img src={githubIcon} alt="zhihu" className={styles.img} />
        </a>
        <a
          href="javascript:;"
          title="查看全部作品"
          onClick={this.showList}
        >
          <i className={globalStyles.iconfont}>&#xe65f;</i>
        </a>
        <a
          onClick={this.handleCreate}
          href="javascript:;"
          title="创作新的作品"
        >
          <i className={globalStyles.iconfont}>&#xe677;</i>
        </a>
        <a
          href="javascript:;"
          title="同步当前作品"
        >
          <i className={globalStyles.iconfont}>&#xe6a2;</i>
        </a>

      </div>
    )
  }
})
