import React, {PropTypes} from 'react'
import sync from '../helpers/sync'
import styles from './PostList.css'
import globalStyles from '../css/global.css'
import * as DataUtils from '../helpers/client_data'
import * as utils from '../helpers/utils'
import * as DbUtils from '../helpers/database'
import {ZHIHU_XSRF_TOKEN_NAME} from '../helpers/const'

function getSyncedPlatforms(post) {
  let platforms = ['zhihu', 'github']
  return platforms.filter(item => !!post[`${item}_id`])
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
    let cookie = DataUtils.getCookiesByPlatform('zhihu') || ''

    sync({
      post,
      value: post.content,
      zhihu: {
        cookie,
        token: utils.getCookieByName(cookie, ZHIHU_XSRF_TOKEN_NAME),
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
      if (post.github_id !== updates.github_id || post.zhihu_id !== updates.zhihu_id) {
        return DbUtils.updatePost(post.id, updates)
      }

      return Promise.resolve(true)
    }).then(updated => {
      if (updated) {
        App.alert('作品同步成功', 'success', '恭喜')
      } else {
        App.alert('作品同步成功，系统内部出现错误', 'warning', '提示')
      }
    }).catch(err => {
      App.alert(err.message, 'error', '同步失败')
    })
  },

  render() {
    let posts = this.props.states.posts.datasource
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
          <a
            onClick={handleSync}
            className={styles.sync}
            href="javascript:;"
            title="同步当前作品"
          >
            <i className={globalStyles.iconfont}>&#xe6a2;</i>
          </a>
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
