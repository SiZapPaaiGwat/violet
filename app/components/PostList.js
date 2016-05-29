import React, {PropTypes} from 'react'
import * as DbUtils from '../helpers/database'
import styles from './PostList.css'

export default React.createClass({
  propTypes: {
    actions: PropTypes.object.isRequired,
    states: PropTypes.object.isRequired
  },

  componentDidMount() {
    DbUtils.listPosts().then((posts) => {
      this.props.actions.postsList({
        posts: posts.reverse()
      })
    })
  },

  render() {
    let list = this.props.states.posts.datasource.map((post, i) => {
      let handleClick = () => {
        this.props.actions.postsSelect(post)
      }
      return (
        <li className={styles.postItem} key={post.id} onClick={handleClick}>
          <div className={styles.postTitle}>
            <span>{post.title}</span>
          </div>
          <div>
            <span className={styles.postPubDate}>{post.id}</span>
            <span>
              <em className={styles.postPlatform}>知乎</em>
              <em className={styles.postPlatform}>GitHub</em>
            </span>
          </div>
        </li>
      )
    })
    return (
      <div className={styles.postContainer}>
        <ul>{list}</ul>
      </div>
    )
  }
})
