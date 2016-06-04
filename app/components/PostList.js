import React, {PropTypes} from 'react'
import styles from './PostList.css'

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
        let parent = this.props.parent
        parent.refs.dialog.hide()
        parent.resetSettings()
      }
      return (
        <li key={post.id} onClick={handleClick}>
          <div className={styles.postTitle}>
            <span>{post.title}</span>
            <div>
              <span className={styles.postPubDate} data-s={post.create_on}>
                {new Date(post.create_on).toLocaleString()}
              </span>
            </div>
          </div>
        </li>
      )
    })
    let el = posts.length ? <ul>{list}</ul> :
      <div className={styles.noPost}>还没有任何作品</div>
    return (
      <div className={styles.postContainer}>
        {el}
      </div>
    )
  }
})
