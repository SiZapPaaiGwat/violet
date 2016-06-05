import React, {PropTypes} from 'react'
import styles from './PostList.css'

function getSyncedPlatforms(post) {
  let platforms = ['zhihu', 'github']
  return platforms.filter(item => !!post[`${item}_id`])
}

export default React.createClass({
  propTypes: {
    actions: PropTypes.object.isRequired,
    states: PropTypes.object.isRequired,
    parent: PropTypes.object.isRequired
  },

  render() {
    let posts = this.props.states.posts.datasource
    let list = posts.map((post, i) => {
      let handleClick = () => {
        this.props.actions.postsSelect(post)
        this.props.actions.settingsShow({name: ''})
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
