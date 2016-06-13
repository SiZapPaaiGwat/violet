import React, {PropTypes} from 'react'
import {syncPostByAccounts, getDatabaseUpdates, getSyncablePlatforms} from '../helpers/sync'
import styles from './PostList.css'
import globalStyles from '../css/global.css'
import * as DbUtils from '../helpers/database'
import Spinner from './Spinner'

// FIXME 这里不要写具体的平台
function getSyncedPlatforms(post) {
  let platforms = ['zhihu', 'github', 'medium']
  return platforms.filter(item => {
    return !!post[`${item}_id`]
  })
}

export default React.createClass({
  propTypes: {
    actions: PropTypes.object.isRequired,
    states: PropTypes.object.isRequired
  },

  /**
   * 同步指定作品
   */
  syncPost(post) {
    let states = this.props.states
    if (!states.status.sync) {
      App.alert('请稍后重试', '应用程序正在初始化...', 'warning')
      return
    }

    // 这里的平台登录态都已经验证
    let account = getSyncablePlatforms(states.account, states.status, post)
    if (Object.keys(account).length === 0) {
      App.alert('没有可以同步的平台', '请至少添加一个平台帐号信息（Medium平台暂不支持编辑）')
      return
    }

    this.props.actions.postsLoading({
      id: post.id,
      isLoading: true
    })

    let syncedPlatforms = []

    syncPostByAccounts({
      post,
      account
    }).then(result => {
      // 更新记录 redux以及数据库
      let updates = getDatabaseUpdates(post.id, result)
      this.props.actions.postsUpdate(updates)
      syncedPlatforms = Object.keys(result)
      return DbUtils.updatePost(post.id, updates)
    }).then(updated => {
      let msg = `作品成功同步到${syncedPlatforms.join(', ')}等${syncedPlatforms.length}个平台`
      this.stopLoading(post.id)
      App.alert('同步成功', msg, 'success')
    }).catch(err => {
      this.stopLoading(post.id)
      App.alert('同步失败', err.message)
    })
  },

  stopLoading(id) {
    this.props.actions.postsLoading({
      id,
      isLoading: false
    })
  },

  render() {
    let selected = this.props.states.posts.selected || {}
    let posts = this.props.states.posts.datasource
    let loadingStatus = this.props.states.posts.loadingStatus
    let list = posts.map((post, i) => {
      /**
       * 点击展示当前作品编辑器内容
       */
      let handleClick = () => {
        this.props.actions.postsSelect(post)
        this.props.actions.settingsShow({name: ''})
      }
      let handleSync = (e) => {
        e.stopPropagation()
        this.syncPost(post)
      }
      let syncedPlatforms = getSyncedPlatforms(post)
      let tip = syncedPlatforms.length ? `已同步平台:${syncedPlatforms.join(', ')}` : '作品还未同步'
      let anchor = loadingStatus[post.id] ? <Spinner /> : (
        <a
          onClick={handleSync}
          className={styles.sync}
          style={{display: post.id === selected.id ? 'block' : 'none'}}
          href="javascript:;"
          title="同步当前作品"
        >
          <i className={globalStyles.iconfont}>&#xe6a2;</i>
        </a>
      )

      return (
        <div
          title={tip}
          key={post.id}
          onClick={handleClick}
          className={syncedPlatforms.length ? styles.calloutSuccess : styles.calloutInfo}
        >
          <span className={styles.postTitle}>{post.title}</span>
          <br />
          <small className={styles.postPubDate}>{new Date(post.create_on).toLocaleString()}</small>
          {anchor}
        </div>
      )
    })
    let el = posts.length ? list : <div className={styles.noPost}>还没有任何作品</div>
    return (
      <div className={styles.postContainer}>
        {el}
      </div>
    )
  }
})
