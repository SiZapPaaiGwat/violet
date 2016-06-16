import React, {PropTypes} from 'react'
import ReactTooltip from 'react-tooltip'
import {
  getDatabaseUpdates, getSyncablePlatforms,
  getSyncedPlatforms, getSyncedTooltip,
  getNotifierInitialTasks, syncPostWithNotifier, isNotifierRunning
} from '../helpers/sync'
import styles from './PostList.css'
import globalStyles from '../css/global.css'
import * as DbUtils from '../helpers/database'
import Spinner from './Spinner'
import {SUPPORT_PLATFORM_MAP} from '../helpers/const'

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
    let account = getSyncablePlatforms(states.account)
    let taskNum = Object.keys(account).length
    if (taskNum === 0) {
      App.alert('没有可以同步的平台', '请至少添加一个平台帐号信息（Medium平台暂不支持编辑）')
      return
    }

    if (isNotifierRunning(states.notifier)) {
      App.alert('同步任务正在进行', '请等待此任务完成后再尝试')
      return
    }

    this.props.actions.postsLoading({
      id: post.id,
      isLoading: true
    })

    this.props.actions.notifierSet(getNotifierInitialTasks(account))

    let taskDone = 0
    syncPostWithNotifier({
      account,
      post,
      onSuccess: (result, platform) => {
        taskDone += 1
        if (taskNum === taskDone) {
          this.stopLoading(post.id)
        }
        this.props.actions.notifierUpdate({
          name: platform,
          label: SUPPORT_PLATFORM_MAP[platform].label,
          status: 'success'
        })

        let updates = getDatabaseUpdates(post.id, result)
        this.props.actions.postsUpdate(updates)
        return DbUtils.updatePost(post.id, updates)
      },
      onError: (err, platform) => {
        taskDone += 1
        if (taskNum === taskDone) {
          this.stopLoading(post.id)
        }
        let status = err.status ? `(HTTP status: ${err.status})` : ''
        this.props.actions.notifierUpdate({
          name: platform,
          label: SUPPORT_PLATFORM_MAP[platform].label,
          status: 'failed',
          details: `${err.message} ${status}`
        })
      }
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
      let tooltip = getSyncedTooltip(post)
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
          key={post.id}
          onClick={handleClick}
          className={syncedPlatforms.length ? styles.calloutSuccess : styles.calloutInfo}
        >
          <span
            data-tip
            data-for={post.id.toString()}
            className={styles.postTitle}
          >
            {post.title}
          </span>
          <ReactTooltip id={post.id.toString()} place="bottom" type="dark" effect="float">
            {tooltip}
          </ReactTooltip>
          <br />
          <small className={styles.postPubDate}>
            {new Date(post.create_on).toLocaleString()}
          </small>
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
