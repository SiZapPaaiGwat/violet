import React, {PropTypes} from 'react'
import sync from '../helpers/sync'
import styles from './PostList.css'
import globalStyles from '../css/global.css'
import * as DataUtils from '../helpers/client_data'
import * as utils from '../helpers/utils'
import * as DbUtils from '../helpers/database'
import {ZHIHU_XSRF_TOKEN_NAME, REQUEST_TIMEOUT} from '../helpers/const'
import Spinner from './Spinner'

function getSyncedPlatforms(post) {
  let platforms = ['zhihu', 'github']
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
    if (!states.status.zhihu && !states.status.github) {
      if (Date.now() - App.mountTime > REQUEST_TIMEOUT) {
        App.alert('同步失败', '请检查平台帐号配置')
      } else {
        App.alert('同步无法进行', '请稍等几秒后重试', 'warning')
      }
      return
    }

    this.props.actions.postsLoading({
      id: post.id,
      isLoading: true
    })
    let cookie = DataUtils.getCookiesByPlatform('zhihu') || ''
    let syncedPlatforms = []
    let token = utils.getCookieByName(cookie, ZHIHU_XSRF_TOKEN_NAME)
    if (!token) {
      console.warn('zhihu token is null, check your cookie')
    }

    sync({
      value: post.content,
      zhihu: {
        cookie,
        token,
        key: post.zhihu_id
      },
      github: {
        ...states.account.github,
        key: post.github_id
      },
      loginStatus: states.status
    }).then(result => {
      // 更新记录 redux以及数据库
      let updates = {
        github_id: result.github && result.github.number,
        zhihu_id: result.zhihu && result.zhihu.slug,
        id: post.id
      }
      this.props.actions.postsUpdate(updates)
      syncedPlatforms = Object.keys(result).filter(plat => {
        return !!result[plat]
      })
      return DbUtils.updatePost(post.id, updates)
    }).then(updated => {
      let msg = `作品成功同步到${syncedPlatforms.join(', ')}等${syncedPlatforms.length}个平台`
      App.alert('同步成功', msg, 'success')
    }).then(() => {
      this.props.actions.postsLoading({
        id: post.id,
        isLoading: false
      })
    }).catch(err => {
      App.alert('同步失败', err.message)
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
